const serverless = require('serverless-http');
const express = require('express');
const app = express();
const cors = require('cors');
// add mysql to access db and run queries
const mysql = require('mysql');

// instruction to use cors
app.use(cors());

// instruction to express to translate the request
// body into JSON
app.use(express.json());

// instruction for connection to borrowMyRescueDB
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: "borrowMyRescueDB"
});

 // get dogs list from database
 app.get("/dogs", function(request, response) {
    // select all the fields in the Dogs table in the 
    // database
    let query = "SELECT * FROM Dogs";
    // error handling
    // show an error message if the list of dogs
    // cannot be retrieved from the database
    connection.query(query, (err, queryResults) => {
      if (err) {
        console.log("Error fetching tasks", err);
        response.status(500).json({
          error: err
        });
      // dogs list can be retrieved return the query results
      } else {
        response.json({
          dogs: queryResults
        });
      }
    });
  });

  // get borrowers list from database
 app.get("/borrowers", function(request, response) {
    // select all the fields in the Borrowers table in the 
    // database
    let query = "SELECT * FROM Borrowers";
     // error handling
    // show an error message if the list of dogs
    // cannot be retrieved from the database
    connection.query(query, (err, queryResults) => {
      if (err) {
        console.log("Error fetching tasks", err);
        response.status(500).json({
          error: err
        });
      // borrowers list can be retrieved return the query results
      } else {
        response.json({
          borrowers: queryResults
        });
      }
    });
  });

module.exports.handler = serverless(app);