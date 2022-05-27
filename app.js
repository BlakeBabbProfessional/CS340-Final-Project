// load the "node" module and assign it to variable "node"
let ini = require('node-ini');

const path = require('path');

const homedir = require('os').homedir();

// parse the MySQL client configuration file, ~/.my.cnf 
// and extract the configuration info under the "client_local" key
// let mysql_config = ini.parseSync(path.join(homedir, '.my.cnf'));
let mysql_config = ini.parseSync('../.my.cnf').client;
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

function results_to_table(results, number_of_columns) {
    columns = []
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

app.get('/customer', (req, res) => {
    mysql_pool.query('SELECT * FROM Customers;',
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.status(200).render('customer', {table: results_to_table(results, 5)})
    });    
})

app.get('/customer/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter
    mysql_pool.query(`SELECT * FROM Customers WHERE ${filter_column} LIKE "${filter}%";`,
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.status(200).render('customer', {table: results_to_table(results, 5)})
    });
})

app.get('/goods', (req, res) => {
    mysql_pool.query('SELECT * FROM Goods;',
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.status(200).render('goods', {table: results_to_table(results, 6)})
    });  
})

app.get('/goods/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter
    mysql_pool.query(`SELECT * FROM Goods WHERE ${filter_column} LIKE "${filter}%";`,
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.status(200).render('goods', {table: results_to_table(results, 6)})
    });
})

app.get('/orders', (req, res) => {
    mysql_pool.query('SELECT * FROM Orders;',
    function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200).render('orders', {table: results_to_table(results, 3)})
    });  
})

app.get('/orders/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter
    mysql_pool.query(`SELECT * FROM Orders WHERE ${filter_column} LIKE "${filter}%";`,
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.status(200).render('orders', {table: results_to_table(results, 3)})
    });
})

app.get('/suppliers', (req, res) => {
    mysql_pool.query('SELECT * FROM Suppliers;',
    function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200).render('suppliers', {table: results_to_table(results, 2)})
    });  
})

app.get('/suppliers/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter
    mysql_pool.query(`SELECT * FROM Suppliers WHERE ${filter_column} LIKE "${filter}%";`,
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.status(200).render('suppliers', {table: results_to_table(results, 2)})
    });
})

app.get('/suppliers-goods', (req, res) => {
    mysql_pool.query('SELECT * FROM SupplierGoods;',
    function(error, results, fields) {
        if (error) {
            res.write(JSON.stringify(error));
            res.end();
        }
        res.status(200).render('suppliers-goods', {table: results_to_table(results, 2)})
    });  
})

app.get('/suppliers-goods/:filter_column/:filter', (req, res) => {
    let filter_column = req.params.filter_column
    let filter = req.params.filter
    mysql_pool.query(`SELECT * FROM SuppliersGoods WHERE ${filter_column} LIKE "${filter}%";`,
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            res.status(200).render('suppliers', {table: results_to_table(results, 2)})
    });
})

app.post('/remove/:table/:attribute/:id', (req, res) => {
    let table = req.params.table
    let attribute = req.params.attribute
    let id = req.params.id

    mysql_pool.query(`DELETE FROM ${table} WHERE ${attribute} = ${id};`,
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
        }
    )
})