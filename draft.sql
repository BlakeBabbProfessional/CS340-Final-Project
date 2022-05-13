-- Clear way for new tables
drop table if exists Customers;
drop table if exists Suppliers;
drop table if exists Goods;
drop table if exists Orders;
drop table if exists Suppliers_Goods;


create table Customers (
    customerId int(11) auto_increment,
    customerFirstName varchar(35) not null,
    customerLastName varchar(35) not null,
    customerDateOfBirth date not null,
    customerTotalCost decimal(38) not null,
    primary key (customerId)
);

create table Orders (
    orderId int(11) auto_increment not null,
    orderPurchaseDate datetime not null,
    customerId int(11),
    primary key (orderId),
    foreign key (customerId) references Customers (customerId)
);

CREATE TABLE `Goods` (
    `itemID` int(11) AUTO_INCREMENT,
    `goodPrice` decimal(11,0) NOT NULL,
    `goodLocationInStore` varchar(15) NOT NULL,
    `goodExpirationDate` date,
    `supplierID` int(11),
    `orderID` int(11), 
    PRIMARY KEY (`itemID`),
    FOREIGN KEY (`orderID`) REFERENCES `orders` (`ordersID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE TABLE `Suppliers` (
    `supplierID` int(11) AUTO_INCREMENT NOT NULL,
    `supplierName` varchar(35) NOT NULL,
    PRIMARY KEY (`supplierID`)
 ) ENGINE=InnoDB DEFAULT CHARSET=utf8;

CREATE `SupplierGoods` (
    `itemID` int(11) NOT NULL,
    `supplierID` int(11) NOT NULL,
    PRIMARY KEY (`itemID`, `supplierID`),
    FOREIGN KEY (`itemID`) REFERENCES `Goods` (`itemID`),
    FOREIGN KEY (`supplierID`) REFERENCES `Suppliers` (`supplierID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;