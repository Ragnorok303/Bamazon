var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var chalk = require('chalk');
var bypass = false;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    showList();
});

function showList() {
    inquirer
        .prompt({
            name: "menu",
            type: "rawlist",
            message: "Welcome to Bamazon Supervisor! What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department"]
        })
        .then(function (answer) {
            switch (answer.menu) {
                case "View Product Sales by Department":
                    viewProductSales();
                    break;
                case "Create New Department":
                    newDepartment()
                    break;
            }
        });
}

function viewProductSales() {

    var query = "select departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(sum(products.product_sales), 0) as product_sales, IFNULL((SUM(products.product_sales) - departments.over_head_costs), 0) as total_profit FROM products RIGHT OUTER JOIN departments on products.department_name = departments.department_name GROUP BY departments.department_id;";
    connection.query(query, function (err, response) {
        if (err) throw err;
        var table = new Table({
            head: ['Department ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
            colWidths: [25, 25, 25, 25, 25]
        });

        for (var i = 0; i < response.length; i++) {

            table.push([response[i].department_id, response[i].department_name, response[i].over_head_costs, response[i].product_sales, response[i].total_profit])
        }

        console.log(table.toString());
        productSalesResponse();

        if (bypass === true) {
            newDepartmentResponse();
        }
    })
}

function newDepartment() {

    connection.query("SELECT * FROM departments", function (err, response) {
        if (err) throw err;
        inquirer.prompt([
            {
                name: "department",
                type: "input",
                message: "What is the name of the department you'd like to add?",
                validate: function (input) {

                    if (input === "" || input === " ") {
                        console.log(chalk.red("\n" + "Please enter a valid ID."))
                        return false;
                    }

                    for (var i = 0; i < response.length; i++) {
                        var dept = response[i].department_name;
                        if (dept.indexOf(input) > -1) {
                            console.log(chalk.red("\n" + "Department name already exists!"))
                            return false;
                        }
                    }
                    return true;
                }
            },
            {
                name: "overhead",
                type: "input",
                message: "What are the overhead costs for this department?",
                validate: function (value) {
                    if (isNaN(value) === false && value > -1) {
                        return true;
                    }
                    console.log(chalk.red("\n" + "Please enter a valid amount."));
                    return false;
                }
            }
        ])
            .then(function (answer) {

                 connection.query("INSERT INTO departments SET ?",
                    {
                        department_name: answer.department,
                        over_head_costs: answer.overhead
                    },
                    function (err) {
                        if (err) throw err;
                        console.log(chalk.green("Department added!"));
                        viewProductSales();
                        bypass = true;
                    }
                )
            })
    })
}

function newDepartmentResponse() {
    inquirer.prompt({
        name: "menu",
        type: "rawlist",
        message: "What would you like to do now?",
        choices: ["Add Another Department", "View Product Sales by Department", "Leave and come back later"]
    })
        .then(function (answer) {
            switch (answer.menu) {
                case "Add Another Department":
                    newDepartment()
                    break;
                case "View Product Sales by Department":
                    viewProductSales();
                    break;
                case "Leave and come back later":
                    leave();
                    break;
            }
        });
}

function productSalesResponse() {
    inquirer.prompt({
        name: "menu",
        type: "rawlist",
        message: "What would you like to do now?",
        choices: ["Add Another Department", "Leave and come back later"]
    })
        .then(function (answer) {
            switch (answer.menu) {
                case "Add Another Department":
                    newDepartment()
                    break;
                case "Leave and come back later":
                    leave();
                    break;
            }
        });
}

function leave() {
    console.log(chalk.blue("See you later!"))
    process.exit();
}