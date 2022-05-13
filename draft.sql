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