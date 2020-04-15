CREATE DATABASE bamazon;

USE bamazon;

DROP TABLE IF EXISTS "departments";

CREATE TABLE "departments" (
  "department_id" int(100) NOT NULL AUTO_INCREMENT,
  "department_name" varchar(100) NOT NULL,
  "over_head_costs" decimal(10,2) NOT NULL,
  PRIMARY KEY ("department-id")
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES "departments" WRITE;

INSERT INTO "departments" ("department_id", "department_name", "over_head_costs")
VALUES
	(1,'Home & Kitchen',2000.00),
	(2,'Jewelry',3000.00),
	(3,'Cell Phones & Accessories',1000.00),
	(4,'Video Games',500.00),
	(5,'Collectibles & Fine Art',1000.00),
	(6,'Pet Supplies',1000.00),
	(7,'Clothing, Shoes, & Jewelry',2000.00),
	(8,'Beauty & Personal Care',500.00),
	(9,'Groceries & Gourmet Food',500.00),
	(10,'Electronics',1000.00),
	(11,'Household Supplies',500.00),
	(12,'TV Shows',1000.00),
	(13,'Garden',3000.00),
	(14,'Outdoor Living',20000.00),
	(15,'Hair Care',2000.00);

UNLOCK TABLES;

DROP TABLE IF EXISTS "products";

CREATE TABLE "products" (
  "item_id" int(11) NOT NULL AUTO_INCREMENT,
  "product_name" varchar(100) NOT NULL,
  "department_name" varchar(100) NOT NULL,
  "price" decimal(10,2) DEFAULT NULL,
  "stock_quantity" int(11) DEFAULT '0',
  "product_sales" decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY ("item_id")
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES "products" WRITE;

INSERT INTO "products" ("item_id", "product_name", "department_name", "price", "stock_quantity", "product_sales")
VALUES
	(1,'Charmin Toilet Paper','Household Supplies',32.96,651,1019.90),
	(2,'Adidas Climate T-shirt','Clothing, Shoes, & Jewelry',18.75,1710,246.35),
	(3,'Hollywood Bleeding, Post Malone','CDs & Vinyl',12.77,44,53.88),
	(4,'Taste of the Wild Dog Food','Pet Supplies',48.99,73,4482.00),
	(5,'Kettle BBQ Chips','Groceries & Gourmet Food',8.59,21,47.48),
	(6,'Batman: The Dark Knight Returns #1','Collectibles & Fine Art',760.00,10,3040.00),
	(7,'Playstation 4','Video Games',367.95,76,36795.00),
	(8,'Star Wars Jedi: Fallen Order','Video Games',39.90,11,399.00),
	(9,'Google Pixel 4 XL - Just Black - 64GB - Unlocked','Cell Phones & Accessories',599.00,202,4556.00),
	(10,'Fashion Protective Face Masks, Unisex Dust Cotton Mouth Masks 1 pack','Beauty & Personal Care',6.70,75,207.00),
	(11,'Steel Nordic Viking Rune Compass Amulet Cufflinks ','Jewelry',15.00,472,3750.00),
	(12,'Wasteland, Baby!, Hozier','Digital Music',6.27,200,41.45),
	(13,'Geometric Hexagonal Glass Vase Wall Sticked Planters Flower Pots/Water Planter Vase','Home & Kitchen',11.99,6,202.17),
	(14,'Giant Memory Foam Beanbag Chair','Home & Kitchen',337.38,6,2361.66),
	(15,'Avatar - The Last Airbender: The Complete Series [Blu-ray] (9 discs in 1 box)','TV Shows',35.99,187,999.60),
	(16,'Google Nest Hub Max - Charcoal','Electronics',229.00,2928,40800.00),
	(17,'Justins Organic Dark Chocolate Almond Butter Cups 12-pack','Groceries & Gourmet Food',28.95,237,156.00),
	(18,'ZippyPaws - Skinny Peltz No Stuffing Squeaky Plush Dog Toy, Fox, Raccoon, and Squirrel - Large','Pet Supplies',8.99,179,630.00),
	(19,'Sunjoy A106005600 Jalen 10 x 8 ft. Steel Classic Pergola with Adjustable Shade, Beige','Garden',449.00,15,1295.00),
	(20,'Under Armour Mens UA x Project Rock World Champ Sleeveless Tank Top Shirt','Clothing, Shoes, & Jewelry',20.00,500,0.00);
	
UNLOCK TABLES;