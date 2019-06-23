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

// code to process dog data
// get dogs list from database
 app.get("/dogs", function(request, response) {
    // select all the fields in the Dogs table in the 
    // database
    let query = "SELECT * FROM Dogs ORDER BY dogName";
    //let query = "SELECT * FROM Dogs";
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

  // post dog details to database
  app.post("/dogs", function(request, response) {
    const dogToBeSaved = request.body;
    console.log(dogToBeSaved);
    connection.query('INSERT INTO Dogs SET ?', dogToBeSaved, function (error, results, fields) {
      if (error) {
      console.log("Error saving new task", error);
      response.status(500).json({
        error: error
      });
      } else {
        response.json({
        dogId: results.insertId
        });
      }
    });
  });

  // delete dog from database
  // example of using a parameter for data update
  app.delete("/dogs/:dogId", function(request, response) {
    const query =
      "DELETE FROM Dogs WHERE dogId = " + connection.escape(request.params.dogId);
    connection.query(query, (err, deleteResults) => {
      if (err) {
        console.log("Error deleting Task", err);
        response.status(500).json({
          error: err
        });
      } else {
          response.status(200).send("Dog details deleted");
      }
    });
  });

  // code to process borrower data

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

  // post borrower details to database
  app.post("/borrowers", function(request, response) {
    const borrowerToBeSaved = request.body;
    console.log(borrowerToBeSaved);
    connection.query('INSERT INTO Borrowers SET ?', borrowerToBeSaved, function (error, results, fields) {
      if (error) {
      console.log("Error saving new task", error);
      response.status(500).json({
        error: error
      });
      } else {
        response.json({
        borrowerId: results.insertId
        });
      }
    });
  });

  // delete borrower from database
  // example of using a parameter for data update
  app.delete("/borrowers/:borrowerId", function(request, response) {
    const query =
      "DELETE FROM Borrowers WHERE borrowerId = " + connection.escape(request.params.borrowerId);
    connection.query(query, (err, deleteResults) => {
      if (err) {
        console.log("Error deleting Task", err);
        response.status(500).json({
          error: err
        });
        console.log(query);
      } else {
        response.status(200).send("Borrower deleted");
      }
    });
  });


// code to retrieve dog/borrower matches from the database

// code to match dog data
// get potential borrowers list from database
app.get("/matches/:dogId", function(request, response) {
  // select all the fields in the Dogs table in the 
  // database
  let query = "SELECT b.borrowerId, d.dogId from Borrowers b " +
  "INNER JOIN Dogs d on b.borrowerDogPace = d.dogPace AND " +
  "b.borrowerDogSize = d.dogSize WHERE dogId = "
  + connection.escape(request.params.dogId)
  + " ORDER b.borrowerId";
  let query = "SELECT * FROM Dogs ORDER BY dogName";
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

module.exports.handler = serverless(app);