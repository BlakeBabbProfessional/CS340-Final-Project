-- Inserting

INSERT INTO Customers (customerFirstName, customerLastName, customerDateOfBirth, customerTotalCost)
    VALUES (:firstName, :lastName, :dateOfBirth, :totalCost);

INSERT INTO Goods (goodPrice, goodLocationInStore, GoodExpirationDate)
    VALUES (:price, :locationInStore, :expirationDate);

INSERT INTO Orders (orderPurchaseDate)
    VALUES (:purchaseDate);

INSERT INTO Suppliers (supplierName)
    VALUES (:supplierName);