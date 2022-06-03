-- Customers
SELECT * FROM Customers;
SELECT customerID FROM Customers;
SELECT customerFirstName FROM Customers;
SELECT customerLastName FROM Customers;
SELECT customerDateOfBirth FROM Customers;
SELECT customerTotalCost FROM Customers;

-- a matching customer id row
DELETE FROM Customers WHERE customerID = :customerIDInput;

-- insert for customer using input values
INSERT INTO Customers (customerFirstName, customerLastName, customerDateOfBirth, customerTotalCost)
VALUES (:firstNameInput, :lastNameInput, :dateOfBirthInput, :totalCostInput);

-- update for customer using input values
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

-- delete a particular row from Suppliers based on ID
DELETE FROM Suppliers WHERE supplierID = :supplierIDInput;

-- insert with input field values
INSERT INTO Suppliers (supplierName)
VALUES (:supplierNameInput);

-- update Suppliers with input field values
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

-- delete a particular row from Goods based on ID
DELETE FROM Goods WHERE itemID = :itemIDInput;

-- insert into Goods using input field values
INSERT INTO Goods (goodPrice, goodLocationInStore, goodExpirationDate)
VALUES (:priceInput, :locationInStoreInput, :expirationDateInput);

-- update Goods with input field values
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

-- deletes a row with matching itemID
DELETE FROM Orders WHERE orderID = :itemIDInput;

-- inserts into orders with input field values
INSERT INTO Orders (orderPurchaseDate)
VALUES (:purchaseDateInput);

-- updates orders with input field values
UPDATE Orders
SET orderPurchaseDate = :purchaseDateInput
WHERE orderID = :idInput;

-- prints out the following attributes to the Orders entity table with the use of JOIN
SELECT orderID, orderPurchaseDate, customerID, customerFirstName, customerLastName
from Orders
join Customers using (customerID);

-- SupplierGoods
SELECT * FROM SupplierGoods;
SELECT itemID FROM SupplierGoods;
SELECT supplierID FROM SupplierGoods;

-- deletes rows that have matching itemIDs= and supplierID
DELETE FROM SupplierGoods WHERE itemID = :itemIDInput AND supplierID = :supplierID;