-- Clear way for new tables
drop table if exists Customers;
drop table if exists Suppliers;
drop table if exists Goods;
drop table if exists Orders;
drop table if exists SuppliersGoods;


create table Customers (
    customerID int(11) auto_increment,
    customerFirstName varchar(35) not null,
    customerLastName varchar(35) not null,
    customerDateOfBirth date not null,
    customerTotalCost decimal(38) not null,
    primary key (customerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

create table Orders (
    orderID int(11) auto_increment not null,
    orderPurchaseDate datetime not null,
    customerID int(11),
    primary key (orderId),
    foreign key (customerID) references Customers (customerID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Goods (
    itemID int(11) AUTO_INCREMENT,
    goodPrice decimal(11,2) NOT NULL,
    goodLocationInStore varchar(15) NOT NULL,
    goodExpirationDate date,
    supplierID int(11),
    orderID int(11),
    PRIMARY KEY (itemID),
    FOREIGN KEY (orderID) REFERENCES Orders (orderID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE Suppliers (
    supplierID int(11) AUTO_INCREMENT NOT NULL,
    supplierName varchar(35) NOT NULL,
    PRIMARY KEY (supplierID)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE SupplierGoods (
    itemID int(11) NOT NULL,
    supplierID int(11) NOT NULL,
    PRIMARY KEY (supplierID, itemID),
    FOREIGN KEY (supplierID) REFERENCES Goods (itemID),
    FOREIGN KEY (itemID) REFERENCES Suppliers (supplierID)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Orders
INSERT INTO Orders (orderPurchaseDate) VALUES (('2022-05-13 05:01:59 PM'), ('2022-12-25 15:11:29 PM'));

-- Goods
INSERT INTO Goods (goodPrice, goodLocationInStore, GoodExpirationDate) VALUES (('12.34', `A5`, `2022-05-18`), ('1.00', 'E10', '2024-10-06'));


