// Import the fs module so that we can read in files.
var fs = require('fs');
// Import express to create and configure the HTTP server.
var express = require('express');
var bodyParser = require('body-parser');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(':memory:');

// Create a HTTP server app.
var app = express();
// Read in the JSON files.
var populationData = JSON.parse(fs.readFileSync('ChangeInAreaPopulation2.json','utf8'));
var earningData = JSON.parse(fs.readFileSync('AnnualEarningbySexAreaYear.json','utf8'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


db.serialize(function(){

  db.run("CREATE TABLE population( id INTEGER PRIMARY KEY AUTOINCREMENT,'area' TEXT, 'sex' TEXT, 'placeName' TEXT, 'statIndicatorAndCensus' TEXT, 'Y2006' INTEGER, 'Y2011' INTEGER)");
  var stmt = db.prepare("INSERT INTO population VALUES (null, ?,?,?,?,?,?)");
  populationData.forEach(function (fill){
    stmt.run(fill.area, fill.sex, fill.placeName, fill.statIndicatorAndCensus, fill.Y2006, fill.Y2011 );
  });
  stmt.finalize();

  db.run("CREATE TABLE earnings( id INTEGER PRIMARY KEY AUTOINCREMENT, 'Sex' TEXT, 'AreaOfResidence' TEXT, 'StatisticalIndicator' TEXT, 'Y2007' INTEGER, 'Y2008' INTEGER, 'Y2009' INTEGER)");
  var stmt = db.prepare("INSERT INTO earnings VALUES (null,?,?,?,?,?,?)");
  earningData.forEach(function (fill){
    stmt.run(fill.Sex, fill.AreaOfResidence, fill.StatisticalIndicator, fill.Y2007, fill.Y2008, fill.Y2009 );
  });
  stmt.finalize();

});

/////////////////////////////////////////////////////////
// gets//////gets////////////gets/////////tegetetg/drgrg/
app.get('/', function(req, res) {
  res.send("This is James' API.");
});

app.get('/population/', function(req, res){
  db.all("SELECT * FROM population", function(err, row) {
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});
app.get('/population/placeName/:id', function(req, res) {
    db.all("SELECT * from population WHERE placeName = " + req.params.id , function(err, row){
      var rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    });
});

app.get('/earnings/', function(req, res){
  db.all("SELECT * FROM earnings", function(err, row) {
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/earnings/AreaOfResidence/:area', function(req, res) {
    db.all("SELECT * from earnings WHERE AreaOfResidence = " + req.params.area , function(err, row){
      var rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    });
});

//returns earnings: sex and area
app.get('/earning/:sex/:area', function(req,res){
  //var sex ="Both";
  db.all("SELECT * FROM earnings WHERE Sex =" + req.params.sex + "AND AreaOfResidence = " + req.params.area , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});
//add in a reference to population for same area given.
app.get('/SexEarning/:sex/:area', function(req,res){
  db.all("SELECT AreaOfResidence, StatisticalIndicator, ((Y2007+ Y2008+ Y2009)/3) AS 'Averge07-08' FROM earnings WHERE Sex = "+ req.params.sex +" AND AreaOfResidence = " + req.params.area , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//compare the sexes wages
app.get('/FemaleEarning/:area', function(req,res){
  db.all("SELECT Sex, AreaOfResidence, StatisticalIndicator, ((Y2007+ Y2008+ Y2009)/3) AS 'Averge07-08' "
        +"FROM earnings WHERE Sex = 'Female' AND AreaOfResidence = " + req.params.area , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//get female wages and population using AreaOfresidence/placeName
app.get('/FemaleEarning/:area', function(req,res){
  db.all("SELECT Sex, AreaOfResidence, StatisticalIndicator, ((Y2007+ Y2008+ Y2009)/3) AS 'Averge07-08' "
        +"FROM earnings WHERE Sex = 'Female' AND AreaOfResidence = " + req.params.area , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

app.get('/TopEarners/:sex', function (req, res){
  db.all("SELECT Sex, AreaOfResidence, StatisticalIndicator, ((Y2007+ Y2008+ Y2009)/3) AS 'Averge07-08' "
        +"FROM earnings WHERE StatisticalIndicator ='Total' AND  Sex = " + req.params.sex
        +" ORDER BY ((Y2007+ Y2008+ Y2009)/3) DESC"
        , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

 


//  + " INNER JOIN population ON earnings.area = population.placeName "
//AreaOfResidence = "+ req.params.area + ""
//AreaOfResidence, StatisticalIndicator, Y2007, Y2008, Y2009
//WHERE
//Questions And Queries to answer////
//===================================
//where there has been a raise in pop,
//where there has been a raise in wage,
//are both areas the same?
//is there a difference between the above for men and women. eg looking for difference
//for example in rural wages for women and a raise in female population in dublin
//list the higest paid areas both/male/female
//show the biggest rise in population and the opposite
//dublin has a decrease in population% in males but an increase in pop% in females
//dublins wages disparity is nearly 30% which id imagine is fairly high country wide.


// Start the server.
var server = app.listen(8000);
