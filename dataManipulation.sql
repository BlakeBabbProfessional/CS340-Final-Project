-- Customers
SELECT * FROM Customers;
SELECT customerID FROM Customers;
SELECT customerFirstName FROM Customers;
SELECT customerLastName FROM Customers;
SELECT customerDateOfBirth FROM Customers;
SELECT customerTotalCost FROM Customers;

DELETE FROM Customers WHERE customerID = :customerIDInput;

-- Suppliers
SELECT * FROM Suppliers;
SELECT supplierID FROM Suppliers;
SELECT supplierName FROM Suppliers;

DELETE FROM Suppliers WHERE supplierID = :supplierIDInput;

-- Goods
SELECT * FROM Goods;
SELECT itemID FROM Goods;
SELECT goodPrice FROM Goods;
SELECT goodLocationInStore FROM Goods;
SELECT goodExpirationDate FROM Goods;
SELECT supplierID FROM Goods;
SELECT orderID FROM Goods;

DELETE FROM Goods WHERE itemID = :itemIDInput;

-- Orders
SELECT * FROM Orders;
SELECT orderID FROM Orders;
SELECT orderPurchaseDate FROM Orders;
SELECT customerID FROM Orders;

DELETE FROM Orders WHERE orderID = :itemIDInput;

-- SupplierGoods
SELECT * FROM SupplierGoods;
SELECT itemID FROM SupplierGoods;
SELECT supplierID FROM SupplierGoods;

DELETE FROM SupplierGoods WHERE itemID = :itemIDInput AND supplierID = :supplierID;

-- Inserting

INSERT INTO Customers (customerFirstName, customerLastName, customerDateOfBirth, customerTotalCost)
    VALUES (:firstNameInput, :lastNameInput, :dateOfBirthInput, :totalCostInput);

INSERT INTO Goods (goodPrice, goodLocationInStore, goodExpirationDate)
    VALUES (:priceInput, :locationInStoreInput, :expirationDateInput);

INSERT INTO Orders (orderPurchaseDate)
    VALUES (:purchaseDateInput);

INSERT INTO Suppliers (supplierName)
    VALUES (:supplierNameInput);

-- Update

UPDATE Customers
    SET customerFirstName = :firstNameInput,
        customerLastName = :lastNameInput,
        customerDateOfBirth = :dateOfBirthInput,
        customerTotalCost = :totalCostInput
    WHERE customerID = :idInput;

UPDATE Goods
    SET goodPrice = :priceInput,
        goodLocationInStore = :locationInStoreInput,
        goodExpirationDate = :expirationDateInput
    WHERE goodID = :idInput;

UPDATE Orders
    SET orderPurcaseDate = :purchaseDateInput
    WHERE orderID = :idInput;

UPDATE Suppliers
    SET supplierName = :supplierNameInput
    WHERE supplierID = :idInput;

-- No update for Suppliers-Goods because it's all primary keys.
