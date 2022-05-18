// load the "node-ini" module and assign it to variable "ini"
let ini = require('node-ini');

// parse the MySQL client configuration file, ~/.my.cnf 
// and extract the configuration info under the "client" key
let mysql_config = ini.parseSync('../.my.cnf').client;

// load the "mysql" module 
let mysql = require('mysql');

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

// get the TCP port number from the ccommandline
let port = process.argv[2];

// configure static routing for the '/static/' subdirectory
app.use('/static', express.static('static'));

app.get('/', (req, res) => { // the arrow notation means: function(req, res) { ...
//    let pool = req.app.get('mysql');
    mysql_pool.query('select * from Customers;',   // could opt to use a setting on `app` instead of a module variable
               function(error, results, fields) {
                   if (error) {
                       res.write(JSON.stringify(error));
                       res.end();
                   }
                //    let id =          results.map(obj => Object.keys(obj).map(k => obj[k])[0]);
                //    let first_name =  results.map(obj => Object.keys(obj).map(k => obj[k])[1]);
                //    let last_name =   results.map(obj => Object.keys(obj).map(k => obj[k])[2]);
                //    let last_update = results.map(obj => Object.keys(obj).map(k => obj[k])[3]);
                //    for (let i = 0; i < id.length; i++) {
                    //    res.write(`<tr><td>${id[i]}</td><td>${first_name[i]}</td><td>${last_name[i]}</td>git <td>${last_update[i]}</td></tr>\n`);
                //    }
		        // res.write("</table>\n");
		   res.end();
    	       });
});

// start the Node.js webserver
app.listen(port, () => {
  // note, for a string delimited with backticks, there is variable 
    // interpolation within the string
    let pid = require('process').pid;
    console.log(`flip[number].engr.oregonstate.edu:${port}`);
});
