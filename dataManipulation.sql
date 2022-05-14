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