// load the "node" module and assign it to variable "node"
let ini = require('node-ini');

const path = require('path');

const homedir = require('os').homedir();

// parse the MySQL client configuration file, ~/.my.cnf 
// and extract the configuration info under the "client_local" key
// let mysql_config = ini.parseSync(path.join(homedir, '.my.cnf'));
let mysql_config = ini.parseSync('../.my.cnf').client;

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

app.get('/customer', (req, res) => {
    let out = ""

    mysql_pool.query('SELECT * FROM Customers;',
        function(error, results, fields) {
            if (error) {
                res.write(JSON.stringify(error));
                res.end();
            }
            let id =                 results.map(obj => Object.keys(obj).map(k => obj[k])[0]);
            let first_name =         results.map(obj => Object.keys(obj).map(k => obj[k])[1]);
            let last_name =          results.map(obj => Object.keys(obj).map(k => obj[k])[2]);
            let date_of_birth =      results.map(obj => Object.keys(obj).map(k => obj[k])[3]);
            let total_amount_spent = results.map(obj => Object.keys(obj).map(k => obj[k])[4]);
            for (let i = 0; i < id.length; i++) {
                out += (`<tr><td>${id[i]}</td><td>${first_name[i]}</td><td>${last_name[i]}</td>git <td>${date_of_birth[i]}</td><td>${total_amount_spent[i]}</td></tr>\n`);
            }
            res.status(200).render('customer', {table: out})
    });    
})

app.get('/goods', (req, res) => {
    res.status(200).render('goods')
})

app.get('/orders', (req, res) => {
    res.status(200).render('orders')
})

app.get('/suppliers', (req, res) => {
    res.status(200).render('suppliers')
})

app.get('/suppliers-goods', (req, res) => {
    res.status(200).render('suppliers-goods')
})