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