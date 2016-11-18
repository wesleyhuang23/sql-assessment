var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var massive = require('massive');
//Need to enter username and password for your database
var connString = "postgres://wesleyhuang@localhost/assessbox";

var app = module.exports = express();

app.use(bodyParser.json());
app.use(cors());


//The test doesn't like the Sync version of connecting,
//  Here is a skeleton of the Async, in the callback is also
//  a good place to call your database seeds.
var db = massive.connect({connectionString : connString},
  function(err, localdb){
    db = localdb;
    app.set('db', db);

    db.user_create_seed(function(){
      console.log("User Table Init");
    });
    db.vehicle_create_seed(function(){
      console.log("Vehicle Table Init");
    });

    app.get('/api/users', function(req, res, next){
      db.get_users([], function(err, users){
        res.send(users);
      });
    });

    app.get('/api/vehicles', function(req, res, next){
      console.log(req.query.email);
      if(req.query.email){
        db.get_vehicles_by_email([req.query.email], function(err, vehicles){
          res.send(vehicles);
        });
      }
      else{
      db.get_vehicles([], function(err, vehicles){
        res.send(vehicles);
      });
    }
    });

    app.post('/api/users', function(req, res, next){

      console.log(req.body.firstname);
      var fn = req.body.firstname;
      var ln = req.body.lastname;
      var email = req.body.email;
      db.add_user([fn, ln, email], function(err, users){
        console.log(err);
        res.send(users);
      });
    });

    app.post('/api/vehicles', function(req, res, next){
      var make = req.body.make;
      var model = req.body.model;
      var year = req.body.year;
      var owner = req.body.ownerId;
      db.add_vehicle([make, model, year, owner], function(err, vehicles){
        console.log(err);
        res.send(vehicles);
      });
    });

    app.get('/api/vehicles/:userId/vehiclecount', function(req, res, next){
      console.log(req.params.userId);
      var id = req.params.userId;
      db.get_num_vehicles([id], function(err, vehicles){
        res.send(vehicles);
      });
    });

    app.get('/api/vehicles/:userId/vehicle', function(req, res, next){
      var id = req.params.userId;
      db.get_cars_by_id([id], function(err, vehicles){
        res.send(vehicles);
      });
    });

});




app.listen('3000', function(){
  console.log("Successfully listening on : 3000");
});

module.exports = app;
