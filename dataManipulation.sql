-- Customers
SELECT * FROM Customers;
SELECT customerID FROM Customers;
SELECT customerFirstName FROM Customers;
SELECT customerLastName FROM Customers;
SELECT customerDateOfBirth FROM Customers;
SELECT customerTotalCost FROM Customers;

DELETE FROM Customers WHERE customerID = :customerIDInput;

INSERT INTO Customers (customerFirstName, customerLastName, customerDateOfBirth, customerTotalCost)
VALUES (:firstNameInput, :lastNameInput, :dateOfBirthInput, :totalCostInput);

UPDATE Customers
SET customerFirstName = :firstNameInput,
    customerLastName = :lastNameInput,
    customerDateOfBirth = :dateOfBirthInput,
    customerTotalCost = :totalCostInput
WHERE customerID = :idInput;

-- Suppliers
SELECT * FROM Suppliers;
SELECT supplierID FROM Suppliers;
SELECT supplierName FROM Suppliers;

DELETE FROM Suppliers WHERE supplierID = :supplierIDInput;

INSERT INTO Suppliers (supplierName)
VALUES (:supplierNameInput);

UPDATE Suppliers
SET supplierName = :supplierNameInput
WHERE supplierID = :idInput;

-- Goods
SELECT * FROM Goods;
SELECT itemID FROM Goods;
SELECT goodPrice FROM Goods;
SELECT goodLocationInStore FROM Goods;
SELECT goodExpirationDate FROM Goods;
SELECT supplierID FROM Goods;
SELECT orderID FROM Goods;

DELETE FROM Goods WHERE itemID = :itemIDInput;

INSERT INTO Goods (goodPrice, goodLocationInStore, goodExpirationDate)
VALUES (:priceInput, :locationInStoreInput, :expirationDateInput);

UPDATE Goods
SET goodPrice = :priceInput,
    goodLocationInStore = :locationInStoreInput,
    goodExpirationDate = :expirationDateInput
WHERE goodID = :idInput;

-- prints out the following attributes to the Goods entity table with the use of JOIN
select itemID, goodPrice, goodLocationInStore, goodExpirationDate, orderID, orderPurchaseDate, supplierID, supplierName
from Goods
join Orders using (orderID)
join Suppliers using (supplierID);

-- Orders
SELECT * FROM Orders;
SELECT orderID FROM Orders;
SELECT orderPurchaseDate FROM Orders;
SELECT customerID FROM Orders;

DELETE FROM Orders WHERE orderID = :itemIDInput;

INSERT INTO Orders (orderPurchaseDate)
VALUES (:purchaseDateInput);

UPDATE Orders
SET orderPurchaseDate = :purchaseDateInput
WHERE orderID = :idInput;

SELECT orderID, orderPurchaseDate, customerID, customerFirstName, customerLastName
from Orders
join Customers using (customerID);

-- SupplierGoods
SELECT * FROM SupplierGoods;
SELECT itemID FROM SupplierGoods;
SELECT supplierID FROM SupplierGoods;

DELETE FROM SupplierGoods WHERE itemID = :itemIDInput AND supplierID = :supplierID;