-- Clear way for new tables
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Suppliers;
DROP TABLE IF EXISTS Goods;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS SupplierGoods;
SET FOREIGN_KEY_CHECKS = 1;

-- Table creation

CREATE TABLE Customers (
    customerID INT(11) AUTO_INCREMENT,
    customerFirstName VARCHAR(35) NOT NULL,
    customerLastName VARCHAR(35) NOT NULL,
    customerDateOfBirth DATE NOT NULL,
    customerTotalCost DECIMAL(8, 2) NOT NULL,
    PRIMARY KEY (customerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Orders (
    orderID INT(11) AUTO_INCREMENT NOT NULL,
    orderPurchaseDate DATETIME NOT NULL,
    customerID INT(11),
    PRIMARY KEY (orderId),
    FOREIGN KEY (customerID) REFERENCES Customers (customerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Goods (
    itemID INT(11) AUTO_INCREMENT,
    goodPrice DECIMAL(11,2) NOT NULL,
    goodLocationInStore VARCHAR(15) NOT NULL,
    goodExpirationDate date,
    supplierID INT(11),
    orderID INT(11),
    PRIMARY KEY (itemID),
    FOREIGN KEY (orderID) REFERENCES Orders (orderID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Suppliers (
    supplierID INT(11) AUTO_INCREMENT NOT NULL,
    supplierName VARCHAR(35) NOT NULL,
    PRIMARY KEY (supplierID)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE SupplierGoods (
    itemID INT(11) NOT NULL,
    supplierID INT(11) NOT NULL,
    PRIMARY KEY (supplierID, itemID),
    FOREIGN KEY (supplierID) REFERENCES Goods (itemID),
    FOREIGN KEY (itemID) REFERENCES Suppliers (supplierID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Insert sample data

-- Orders
INSERT INTO Orders (orderPurchaseDate)
    VALUES ('2022-05-13 05:01:59 PM'), ('2022-12-25 15:11:29 PM');

-- Goods
INSERT INTO Goods (goodPrice, goodLocationInStore, GoodExpirationDate)
    VALUES ('12.34', 'A5', '2022-05-18'), ('1.00', 'E10', '2024-10-06');

-- Customers
INSERT INTO Customers (CUSTOMERFIRSTNAME, CUSTOMERLASTNAME, CUSTOMERDATEOFBIRTH, CUSTOMERTOTALCOST)
    VALUES ('Joe', 'Schmoe', '1983/8/23', 12.39),
           ('Sarah', 'Smith', '1999/12/3', 99.99),
           ('Bo', 'Schmoe', '2007/3/12', 12.39);

-- Suppliers
INSERT INTO Suppliers (supplierName)
    VALUES ('Fruity Farms'), ('Mack''s Milk'), ('Super Soy');
