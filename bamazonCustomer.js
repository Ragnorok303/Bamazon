var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table');
var chalk = require('chalk');
var figlet = require('figlet');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "R@gnorok303B@man",
    database: "bamazon"
});

figlet('BAMAZON!', function (err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});

connection.connect(function (err) {
    if (err) throw err;
    showTable();
});

function showTable(newPurchases) {
    connection.query("SELECT * FROM products", function (err, response) {
        var table = new Table({
            head: ['ID', 'Product', 'Price'],
            colWidths: [5, 50, 10]
        });

        for (var i = 0; i < response.length; i++) {
            table.push([response[i].item_id, response[i].product_name, response[i].price])
        }
        console.log(table.toString());

        if (newPurchases) {
            inquirer.prompt({
                name: "updateTable",
                type: "rawlist",
                message: "What would you like to do now?",
                choices: ["Purchase another item",
                    "Come back later"]
            })
                .then(function (answer) {
                    switch (answer.updateTable) {
                        case "Purchase another item":
                            updateItems()
                            break;
                        case "Come back later":
                            leave();
                            break;
                    }
                });
        } 
        else {
            updateItems();
        }
    })
}

function updateItems() {
    connection.query("SELECT * FROM products", function (err, response) {
        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "input",
                    message: "What is the ID of the item you'd like to purchase?",
                    validate: function (input) {
                        var IDarray = []
                        for (var i = 0; i < response.length; i++) {
                            var IDs = response[i].item_id;
                            IDarray.push(IDs)
                        }
                        if (IDarray.indexOf(Number(input)) > -1) {
                            return true;
                        }
                        console.log(chalk.red("\n" + "Item doesn't exist! Please pick another!"))
                        return false;
                    }
                },
                {
                    name: "stock",
                    type: "input",
                    message: "How many units would you like to purchase?",
                    validate: function (value) {
                        if (isNaN(value) === false && value > 0) {
                            return true;
                        }
                        else {
                            console.log(chalk.red("\n" + "Please enter a valid number."))
                            return false;
                        }
                    }
                }
            ])
            .then(function (answer) {
                var chosenItem;
                connection.query("SELECT * FROM products WHERE item_id=?", answer.choice, function (err, response) {
                    for (var i = 0; i < response.length; i++) {
                        if (Number(response[i].item_id) === Number(answer.choice)) {
                            chosenItem = response[i];
                        }
                    }

                    var inStock = (answer.stock <= chosenItem.stock_quantity);
                    if (!inStock) {
                        console.log(chalk.red("Insufficient quantity!"));
                        handlePurchase(inStock);
                    } else {

                        var stockUpdate = chosenItem.stock_quantity - answer.stock;
                        var productSales = chosenItem.product_sales;
                        var purchasePrice = answer.stock * chosenItem.price;
                        var total = (answer.stock * chosenItem.price) + productSales;
                        var itemName = chosenItem.product_name;

                        var query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: stockUpdate,
                                    product_sales: total
                                },
                                {
                                    item_id: answer.choice
                                }
                            ],

                            function (error) {
                                if (error) throw err;
                                console.log(chalk.green("Purchased successfully! Your order total for " + itemName + " is " + "$" + purchasePrice + "!"));
                                handlePurchase(inStock);
                            });
                    }
                })
            })
    })
}

function handlePurchase(result) {
    var success = {
        name: "list",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Make another purchase",
            "Come back later"
        ]
    }

    var failure = {
        name: "list",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "Purchase a different item or less of this item", "Come back later"
        ]
    }

    var response = result ? success : failure;

    inquirer.prompt([
        response
    ])
        .then(function (answer) {
            switch (answer.list) {
                case "Purchase a different item or less of this item":
                case "Make another purchase":
                    showTable();
                    break;
                case "Come back later":
                    leave();
                    break;
            }
        })
}

function leave() {
    console.log(chalk.blue("See you later!"))
    process.exit();
}