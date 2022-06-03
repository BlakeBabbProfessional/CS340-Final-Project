// load the "node" module and assign it to variable "node"
let ini = require('node-ini');

const path = require('path');

const homedir = require('os').homedir();

// parse the MySQL client configuration file, ~/.my.cnf 
// and extract the configuration info under the "client_local" key
let mysql_config = ini.parseSync(path.join(homedir, '.my.cnf')).client;
// let mysql_config = ini.parseSync('../.my.cnf').client;
// let mysql_config = ini.parseSync('/etc/my.cnf');

// load the "mysql" module 
let mysql = require('mysql');

let exphbs = require('express-handlebars');

// create a MySQL connection pool object using the
// database server hostname, database username, 
// database user password, and database name specified
// in the MySQL client configuration file
let mysql_pool = mysql.createPool({
    connectionLimit : 10,
    host            : mysql_config.host,
    user            : mysql_config.user,
    password        : mysql_config.password,
    database        : mysql_config.database});

// load the "express" module
let express = require('express');
const { table } = require('console');
const { isContext } = require('vm');

// create the Express application object
let app = express();
// let exphbs = require('express-handlebars')

// get the TCP port number from the ccommandline
let port = process.argv[2];

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

app.use(express.json())
app.use(express.static('public'))

// start the Node.js webserver
app.listen(port, () => {
    // note, for a string delimited with backticks, there is variable 
      // interpolation within the string
      let pid = require('process').pid;
      console.log(`flip[number].engr.oregonstate.edu:${port}`);
});  

app.get('/', (req, res) => {
    res.status(200).render('index')
});

///////////////////////////////////////////////////////////////////////////////////////////////////
//// Functions to convert raw results into html

function results_to_table(results, number_of_columns) {
    let columns = []
    let table = ""
    if (!results) {return table}
    for (let i = 0; i < number_of_columns; i++) {
        columns.push(results.map(obj => Object.keys(obj).map(k => obj[k])[i]))
    }
    // for each row fill each cell through each column
    for (let i = 0; i < columns[0].length; i++) {
        table += `<tr>`
        for (let j = 0; j < columns.length; j++) {
            table += `<td>${columns[j][i]}</td>`
        }
        table += `<td><button name="entity-remove-button" id=${columns[0][i]}>remove</button></td>`
    } 
    return table
}
    // converter function for suppliers (raw -> html)
function results_to_select_supplier(results) {
    // (id, name)
    let columns = []
    let number_of_columns = 2
    let select = `<select name="supplier-fk-input" id="supplier-fk-input">`
    if (!results) {return select}
    for (let i = 0; i < number_of_columns; i++) {
        columns.push(results.map(obj => Object.keys(obj).map(k => obj[k])[i]))
    }
    for (let i = 0; i < columns[0].length; i++) {
        select += `<option value = "${columns[0][i]}">${columns[1][i]} (${columns[0][i]})</option>`
    }
    select += `</select>`
    return select
}
    // converter function for orders (raw -> html)
function results_to_select_order(results) {
    // (id, date)
    let columns = []
    let number_of_columns = 2
    let select = `<select name="order-fk-input" id="order-fk-input"> <option value = "NULL">none</option>`
    if (!results) {return select}
    for (let i = 0; i < number_of_columns; i++) {
        columns.push(results.map(obj => Object.keys(obj).map(k => obj[k])[i]))
    }
    for (let i = 0; i < columns[0].length; i++) {
        select += `<option value = "${columns[0][i]}">${columns[1][i]} (${columns[0][i]})</option>`
    }
    select += `</select>`
    return select
}
    // converter function for customer (raw -> html)
function results_to_select_customer(results) {
    // (id, firstname, lastname)
    let columns = []
    let number_of_columns = 3
    let select = `<select name="customer-fk-input" id="customer-fk-input"> <option value = "NULL">none</option>`
    if (!results) {return select}
    for (let i = 0; i < number_of_columns; i++) {
        columns.push(results.map(obj => Object.keys(obj).map(k => obj[k])[i]))
    }
    for (let i = 0; i < columns[0].length; i++) {
        select += `<option value = "${columns[0][i]}">${columns[1][i]} ${columns[2][i]} (${columns[0][i]})</option>`
    }
    select += `</select>`
    return select
}
    // converter function for good (raw -> html)
function results_to_select_good(results) {
    // (id, price, location)
    let columns = []
    let number_of_columns = 3
    let select = `<select name="good-fk-input" id="good-fk-input">`
    if (!results) {return select}
    for (let i = 0; i < number_of_columns; i++) {
        columns.push(results.map(obj => Object.keys(obj).map(k => obj[k])[i]))
    }
    for (let i = 0; i < columns[0].length; i++) {
        select += `<option value = "${columns[0][i]}">$${columns[1][i]}, ${columns[2][i]} (${columns[0][i]})</option>`
    }
    select += `</select>`
    return select
}

///////////////////////////////////////////////////////////////////////////////////////////////////
//// Selecting

// displays all attributes of customer, unfiltered version
app.get('/customer', (req, res) => {
    mysql_pool.query('SELECT * FROM Customers;',
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            res.status(200).render('customer', {table: results_to_table(results, 5)})
    });    
})

// displays all attributes of customer, filtered based on user input
app.get('/customer/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter
    mysql_pool.query(`SELECT * FROM Customers WHERE ${filter_column} LIKE "${filter}%";`,
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            res.status(200).render('customer', {table: results_to_table(results, 5)})
    });
})

// goods, unfiltered
app.get('/goods', (req, res) => {
    let callbackCount = 0
    let tableResults
    let supplierFkSelectResults
    let orderFkSelectResults
    // displays relationship + main attributes of orders (orders and suppliers being joined)
    mysql_pool.query(`SELECT itemID, goodPrice, goodLocationInStore, goodExpirationDate, orderID, orderPurchaseDate, supplierID, supplierName FROM Goods JOIN Orders USING (orderID) JOIN Suppliers USING (supplierID);`,
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            tableResults = results
            complete()
    })

    // order fk dropdown
    mysql_pool.query('SELECT orderID, orderPurchaseDate FROM Orders;',
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            orderFkSelectResults = results
            complete()
    })

    // supplier fk dropdown
    mysql_pool.query('SELECT supplierID, supplierName FROM Suppliers;',
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            supplierFkSelectResults = results
            complete()
    })

    // when a query is successful, increment until condition is met, then render the page with the JS object that has all the relevant data
    // to display with handlebars and dropdowns
    function complete() {
        callbackCount++;
            if(callbackCount >= 3) {
                res.status(200).render('goods', {
                    table: results_to_table(tableResults, 8), 
                    orderFkSelect: results_to_select_order(orderFkSelectResults),
                    supplierFkSelect: results_to_select_supplier(supplierFkSelectResults)
                });
            }
    }
})

// goods, filtered
app.get('/goods/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter

    let callbackCount = 0
    let tableResults
    let supplierFkSelectResults
    // displays relationship + main attributes of goods (orders and suppliers being joined)
    mysql_pool.query(`SELECT itemID, goodPrice, goodLocationInStore, goodExpirationDate, orderID, orderPurchaseDate, supplierID, supplierName FROM Goods JOIN Orders USING (orderID) JOIN Suppliers USING (supplierID) WHERE ${filter_column} LIKE "${filter}%";`,
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            tableResults = results
            complete()
        })
    // order fk dropdown
    mysql_pool.query('SELECT orderID, orderPurchaseDate FROM Orders;',
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            orderFkSelectResults = results
            complete()
    })
    // supplier dropdown
    mysql_pool.query('SELECT supplierID, supplierName FROM Suppliers;',
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            supplierFkSelectResults = results
            complete()
    })
    // when a query is successful, increment until condition is met, then render the page with the JS object that has all the relevant data
    // to display with handlebars and dropdowns
    function complete() {
        callbackCount++;
        if(callbackCount >= 3) {
            res.status(200).render('goods', {
                table: results_to_table(tableResults, 8), 
                orderFkSelect: results_to_select_order(orderFkSelectResults),
                supplierFkSelect: results_to_select_supplier(supplierFkSelectResults)
            });
        }
    }
})

// orders, unfiltered
app.get('/orders', (req, res) => {
    let callbackCount = 0
    let tableResults
    let customerFkSelectResults

    // displays relationship + main attributes of orders (customers being joined)
    mysql_pool.query('SELECT orderID, orderPurchaseDate, customerID, customerFirstName, customerLastName from Orders join Customers using (customerID);',
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            tableResults = results
            complete()
        })
    // customer fk dropdown
    mysql_pool.query('SELECT customerID, customerFirstName, customerLastName FROM Customers;',
        function(error, results, fields) {
            if (error) {
                let e = JSON.stringify(error)
                res.status(400).write(e)
                res.end()
                return
            }
            customerFkSelectResults = results
            complete()
        })

    // when a query is successful, increment until condition is met, then render the page with the JS object that has all the relevant data
    // to display with handlebars and dropdowns
    function complete() {
        callbackCount++;
        if(callbackCount >= 2) {
            res.status(200).render('orders', {
                table: results_to_table(tableResults, 5), 
                customerFkSelect: results_to_select_customer(customerFkSelectResults),
            });
        }
    }
})

// this part of the code handles the filtering functionality for orders
app.get('/orders/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter

    let callbackCount = 0
    let tableResults
    let customerFkSelectResults

    // displays core information as well as relevant relationship information to the user based on their filter input
    mysql_pool.query(`SELECT orderID, orderPurchaseDate, customerID, customerFirstName, customerLastName from Orders join Customers using (customerID) WHERE ${filter_column} LIKE "${filter}%";`,
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        tableResults = results
        complete()
    })

    // customer fk dropdown + update JK results
    mysql_pool.query('SELECT customerID, customerFirstName, customerLastName FROM Customers;',
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            customerFkSelectResults = results
            complete()
        })

    // when a query is successful, increment until condition is met, then render the page with the JS object that has all the relevant data
    // to display with handlebars and dropdowns
    function complete() {
        callbackCount++;
        if(callbackCount >= 2) {
            res.status(200).render('orders', {
                table: results_to_table(tableResults, 5), 
                customerFkSelect: results_to_select_customer(customerFkSelectResults),
        });
    }
}
})

// renders the suppliers with all the relevant attributes, unfiltered
app.get('/suppliers', (req, res) => {
    mysql_pool.query('SELECT * FROM Suppliers;',
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        res.status(200).render('suppliers', {table: results_to_table(results, 2)})
    });  
})

// displays all attributes of suppliers, filtered based on filter option
app.get('/suppliers/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter
    mysql_pool.query(`SELECT * FROM Suppliers WHERE ${filter_column} LIKE "${filter}%";`,
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            res.status(200).render('suppliers', {table: results_to_table(results, 2)})
    });
})

// suppliers-goods, unfiltered
app.get('/suppliers-goods', (req, res) => {
    let callbackCount = 0
    let tableResults
    let supplierFkSelectResults
    let goodFkSelectResults

    let sql = `
        select Goods.itemID, goodPrice, goodLocationInStore, SupplierGoods.supplierID, supplierName
        from SupplierGoods
        join Goods on SupplierGoods.itemID = Goods.itemID
        join Suppliers on Suppliers.supplierID = SupplierGoods.supplierID;
    `

    // main table
    mysql_pool.query(sql,
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            tableResults = results
            complete()
        })

    // supplier fk dropdown
    mysql_pool.query('SELECT supplierID, supplierName FROM Suppliers;',
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        supplierFkSelectResults = results
        complete()
    })

    // this query grabs the information for the Goods entity table - with joined tables Order and Suppliers
    // good fk dropdown
    mysql_pool.query('SELECT itemID, goodPrice, goodLocationInStore FROM Goods;',
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        goodFkSelectResults = results
        complete()
    })

    // when a query is successful, increment until condition is met, then render the page with the JS object that has all the relevant data
    // to display with handlebars and dropdowns
    function complete() {
        callbackCount++;
        if(callbackCount >= 3) {
            res.status(200).render('suppliers-goods', {
                table: results_to_table(tableResults, 5), 
                supplierFkSelect: results_to_select_supplier(supplierFkSelectResults),
                goodFkSelect: results_to_select_good(goodFkSelectResults)
        });
    }}
})

// suppliers-goods filtered
app.get('/suppliers-goods/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter

    let callbackCount = 0
    let tableResults
    let supplierFkSelectResults
    let goodFkSelectResults

    let sql = `
        select Goods.itemID, goodPrice, goodLocationInStore, SupplierGoods.supplierID, supplierName
        from SupplierGoods
        join Goods on SupplierGoods.itemID = Goods.itemID
        join Suppliers on Suppliers.supplierID = SupplierGoods.supplierID
        where ${filter_column} like "${filter}%";
    `

    mysql_pool.query(sql,
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            tableResults = results
            complete()
        })
    // supplier fk dropdown
    mysql_pool.query('SELECT supplierID, supplierName FROM Suppliers;',
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        supplierFkSelectResults = results
        complete()
    })

    // good fk dropdown
    mysql_pool.query('SELECT itemID, goodPrice, goodLocationInStore FROM Goods;',
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        goodFkSelectResults = results
        complete()
    })

    // when a query is successful, increment until condition is met, then render the page with the JS object that has all the relevant data
    // to display with handlebars and dropdowns
    function complete() {
        callbackCount++;
        if(callbackCount >= 3) {
            res.status(200).render('suppliers-goods', {
                table: results_to_table(tableResults, 5), 
                supplierFkSelect: results_to_select_supplier(supplierFkSelectResults),
                goodFkSelect: results_to_select_good(goodFkSelectResults)
        });
    }}
})

///////////////////////////////////////////////////////////////////////////////////////////////////
//// inserting

// customer page // get parameters from the URL and execute the query with the input values
app.post('/customer/:amount_spent/:first_name/:last_name/:dob', (req, res) => {
    let add_amount_spent = req.params.amount_spent
    let add_first_name = req.params.first_name
    let add_last_name = req.params.last_name
    let add_dob = req.params.dob

    mysql_pool.query(`INSERT INTO Customers 
    (customerFirstName, customerLastName, customerDateOfBirth, customerTotalCost) 
    VALUES ('${add_first_name}', '${add_last_name}', '${add_dob}', '${add_amount_spent}');`,
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        res.status(200).write("Success!")
        res.end()
    });
});

// good page // get parameters from the URL and execute the query with the input values
app.post('/goods/:price/:location/:expiration_date/:order_key/:supplier_key', (req, res) => {
    let add_price = req.params.price
    let add_location = req.params.location
    let add_expiration_date = req.params.expiration_date
    let add_order_key = req.params.order_key
    let add_supplier_key = req.params.supplier_key

    mysql_pool.query(`INSERT INTO Goods 
    (goodPrice, goodLocationInStore, goodExpirationDate, orderID, supplierID) 
    VALUES ('${add_price}', '${add_location}', '${add_expiration_date}', ${add_order_key}, ${add_supplier_key});`,
    function(error, results, fields) {
        if (error) {
            let e = JSON.stringify(error)
            res.status(400).write(e)
            res.end()
            return
        }
        res.status(200).write("Success!")
        res.end()
    });
});

// order page // get parameters from the URL and execute the query with the input values
app.post('/orders/:purchase_date/:customer_key', (req, res) => {
    let add_purchase_date = req.params.purchase_date
    let add_customer_key = req.params.customer_key

    mysql_pool.query(`INSERT INTO Orders (orderPurchaseDate, customerID) VALUES ('${add_purchase_date}', ${add_customer_key});`,
    function(error, results, fields) {
        if (error) {
            let e = JSON.stringify(error)
            console.log(e)
            res.status(400).write(e);
            res.end();
            return
        }
        res.status(200).write("Success!")
        res.end()
    });
});

// supplier page // get parameters from the URL and execute the query with the input values
app.post('/suppliers/:supplier_name', (req, res) => {
    let add_supplier_name = req.params.supplier_name

    mysql_pool.query(`INSERT INTO Suppliers (supplierName) VALUES ('${add_supplier_name}');`, 
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        res.status(200).write("Success!")
        res.end()
    });
});

// supplier-good page // get parameters from the URL and execute the query with the input values
app.post('/suppliers-goods/:supplier_key/:good_key', (req, res) => {
    let add_supplier_key = req.params.supplier_key
    let add_good_key = req.params.good_key

    mysql_pool.query(`INSERT INTO SupplierGoods (itemID, supplierID) VALUES (${add_good_key}, ${add_supplier_key});`, 
    function(error, results, fields) {
        if (error) {
            let e = JSON.stringify(error)
            console.log(e)
            res.status(400).write(e)
            res.end()
            return
        }
        res.status(200).write("Success!")
        res.end()
    });
});

///////////////////////////////////////////////////////////////////////////////////////////////////
//// Deleting
// general case // removes a row from the table based on the ID
app.post('/remove/:table/:attribute/:id', (req, res) => {        
    let table = req.params.table
    let attribute = req.params.attribute
    let id = req.params.id

    mysql_pool.query(`DELETE FROM ${table} WHERE ${attribute} = ${id};`,
        function(error, results, fields) {
            if (error) {
                res.status(400).write(JSON.stringify(error));
                res.end();
                return
            }
            res.status(200).write("Success!")
            res.end()
        });
});

///////////////////////////////////////////////////////////////////////////////////////////////////
//// updating

// customer page // updates a row to the input values based on customer ID selected
app.post('/customer/:customer_id/:amount_spent/:first_name/:last_name/:dob', (req, res) => {
    let update_id = req.params.customer_id
    let update_amount_spent = req.params.amount_spent
    let update_first_name = req.params.first_name
    let update_last_name = req.params.last_name
    let update_dob = req.params.dob

    mysql_pool.query(`UPDATE Customers SET customerFirstName = '${update_first_name}', customerLastName = '${update_last_name}', customerDateOfBirth = '${update_dob}', customerTotalCost = '${update_amount_spent}' WHERE customerID = '${update_id}';`,
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        res.status(200).write("Success!")
        res.end()
    });
});

// goods page // updates a row to the input values based on customer ID selected
app.post('/goods/:goods_id/:price/:location/:expiration_date', (req, res) => {
    let update_id = req.params.goods_id
    let update_price = req.params.price
    let update_location = req.params.location
    let update_expiration_date = req.params.expiration_date

    mysql_pool.query(`UPDATE Goods SET goodPrice = '${update_price}', goodLocationInStore = '${update_location}', goodExpirationDate = '${update_expiration_date}' WHERE itemID = '${update_id}';`,
    function(error, results, fields) {
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        res.status(200).write("Success!")
        res.end()
    });
});

// orders page // updates a row to the input values based on customer ID selected
app.post('/orders/:order_id/:purchase_date', (req, res) => {
    let update_id = req.params.order_id
    let update_purchase_date = req.params.purchase_date

    mysql_pool.query(`UPDATE Orders SET orderPurchaseDate = '${update_purchase_date}' WHERE orderID = '${update_id}';`,
    function(error, results, fields){
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        res.status(200).write("Success!")
        res.end()
    });
});

// suppliers page // updates a row to the input values based on customer ID selected
app.post('/suppliers/:supplier_id/:supplier_name', (req, res) => {
    let update_id = req.params.supplier_id
    let update_supplier_name = req.params.supplier_name

    mysql_pool.query(`UPDATE Suppliers SET supplierName = '${update_supplier_name}' WHERE supplierID = '${update_id}';`,
    function(error, results, fields){
        if (error) {
            res.status(400).write(JSON.stringify(error));
            res.end();
            return
        }
        res.status(200).write("Success!")
        res.end()
    });
});
