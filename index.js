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
var populationData = JSON.parse(fs.readFileSync('ChangeInAreaPopulation3.json','utf8'));
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

//////reurns population*
app.get('/population/', function(req, res){
  db.all("SELECT * FROM population", function(err, row) {
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//////returns population*: placeName
app.get('/population/placeName/:id', function(req, res) {
    db.all("SELECT * from population WHERE placeName = " + req.params.id , function(err, row){
      var rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    });
});

//////returns popuilation*: id
app.get('/population/id/:id', function(req, res) {
    db.all("SELECT * from population WHERE id = " + req.params.id , function(err, row){
      var rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    });
});


//////returns earnings*
app.get('/earnings/', function(req, res){
  db.all("SELECT * FROM earnings", function(err, row) {
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

////////returns earnings* : AreaOfResidence
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
//////returns earnings(area,stat,and averge): sex and area
app.get('/SexEarning/:sex/:area', function(req,res){
  db.all("SELECT AreaOfResidence, StatisticalIndicator, ((Y2007+ Y2008+ Y2009)/3) AS 'Averge07-09' FROM earnings WHERE Sex = "
    + req.params.sex +" AND AreaOfResidence = "
    + req.params.area , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

/////returns earnings(sex, area, stats) : sex, area
app.get('/FemaleEarning/:area', function(req,res){
  db.all("SELECT Sex, AreaOfResidence, StatisticalIndicator, ((Y2007+ Y2008+ Y2009)/3) AS 'Averge07-09' "
        +"FROM earnings WHERE Sex = 'Female' AND AreaOfResidence = " + req.params.area
        , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

/////returns earnings(sex, area, stats) : sex, area
app.get('/MaleEarning/:area', function(req,res){
  db.all("SELECT Sex, AreaOfResidence, StatisticalIndicator, ((Y2007+ Y2008+ Y2009)/3) AS 'Averge07-09' "
        +"FROM earnings WHERE Sex = 'Male' AND AreaOfResidence = " + req.params.area , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

/////returns earnings(sex, area, stat, average): Stat, sex
app.get('/TopEarners/:sex', function (req, res){
  db.all("SELECT Sex, AreaOfResidence, StatisticalIndicator, ((Y2007+ Y2008+ Y2009)/3) AS 'Averge07-09' "
        +"FROM earnings WHERE StatisticalIndicator ='Total' AND  Sex = " + req.params.sex
        +" ORDER BY ((Y2007+ Y2008+ Y2009)/3) DESC"
        , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});

//returns population & earnings(pop.area, earnings.area, sex, ):
app.get('/PopEarning/:sex/:province', function(req,res){
  db.all("SELECT population.area AS Area, earnings.AreaOfResidence AS Province,"
        +" earnings.Sex AS Sex, ((earnings.Y2007+ earnings.Y2008+ earnings.Y2009)/3) AS 'AvergeWage07-09', "
        +" population.Y2006 AS PopulationGrowth2006, population.Y2011 AS PopulationGrowth2011 "
        +" FROM earnings INNER JOIN population WHERE "
        +" population.placeName = "+ req.params.province +" AND earnings.AreaOfResidence ="+ req.params.province +" AND population.area = 'State'"
        +" AND earnings.StatisticalIndicator ='Total' AND population.statIndicatorAndCensus = 'Actual Change Since Previous Census (Number)' "
        +" AND earnings.Sex = "+req.params.sex +" AND population.sex = "+ req.params.sex
        , function(err, row){
        var rowString = JSON.stringify(row, null, '\t');
        res.sendStatus(rowString);
        });
  });

///////////////////////////////////////////////////////////////////
///////delete drom both tables/////////////////////////////////////
app.get('/deletePop/:id', function(req,res){
  db.all("DELETE FROM population WHERE id =" + req.params.id + " " , function(err,row){
    res.send("The population data " + req.params.id + " has been deleted");
  });

});

app.get('/deleteEarning/:id', function(req,res){
  db.all("DELETE FROM earnings WHERE id =" + req.params.id + " " , function(err,row){
    res.send("The earnings data " + req.params.id + " has been deleted");
  });

});

/////////////////////////////////////////////////////////////////
///////put////too much information to get froma user ///////////

app.put('/updatePop/:id/:parameter/:value', function (req, res){
  db.all("UPDATE population SET "+ req.params.parmeter +" = " + req.params.value + " WHERE id = "+ req.params.id,
  function(err, row){
    res.send("The population data id number "+req.params.id+ "has been updated");
  })
});


/*
  /////returns earnings(sex, area, stat, average): Stat, sex
  app.get('/TopEarnersPopulationGrowth/:sex', function (req, res){
    db.all("SELECT earnings.Sex, earnings.AreaOfResidence, earnings.StatisticalIndicator, ((earnings.Y2007+ earnings.Y2008+ earnings.Y2009)/3) AS 'AvergeWage07-09', "
          +" "
          +"FROM earnings WHERE StatisticalIndicator ='Total' AND  Sex = " + req.params.sex
          +" ORDER BY ((Y2007+ Y2008+ Y2009)/3) DESC"
          , function(err, row){
      var rowString = JSON.stringify(row, null, '\t');
      res.sendStatus(rowString);
    });
  });


//////need to return an inner join from both Datasets
app.get('/pop&earning/:area', function(req,res){
  db.all("SELECT earnings.Sex AS Sex, earnings.AreaOfResidence AS Area, earnings.StatisticalIndicator AS EARNStat, earnings.((Y2007+ Y2008+ Y2009)/3) AS 'Averge07-09', "
        +" population.statIndicatorAndCensus AS POPStat, population.Y2006 AS Y2006, population.Y2011 AS Y2011 "
        +" FROM earnings INNER JOIN population WHERE earnings.StatisticalIndicator ='Total' AND population.statIndicatorAndCensus = 'Population Change Since Previous Census (%)'"
        +" AND earnings.AreaOfResidence LIKE \"%"+ req.params.area+ "%\" AND population.area LIKE \"%" + req.params.area +"%\" "
        , function(err, row){
    var rowString = JSON.stringify(row, null, '\t');
    res.sendStatus(rowString);
  });
});
*/

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
