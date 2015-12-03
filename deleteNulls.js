

var fs = require('fs');

var data = JSON.parse(fs.readFileSync('ChangeinAreaPop.json','utf8'));
var outputFile= 'changedFile.json';
var result = [];

//for(i = 1; 1<data.length; i++){

function sort() {
  data.forEach(function(seekOut){

   if(seekOut.Area.search("Aggregate Town Area") != -1){
     console.log("Nice one Guv");
     result.push(seekOut);
   }
 })

};

sort();

fs.writeFile(outputFile, JSON.stringify(result, 0),function(err) {
    if(err) {
      console.log(err);
    } else {
      console.log("JSON saved to " + outputFile);
    }
  }
);
reurns population*
http://127.0.0.1:8000/population/

returns population*: placeName
http://127.0.0.1:8000/population/placeName/:id


//returns popuilation*: id
http://127.0.0.1:8000/population/id/:id


returns earnings*
http://127.0.0.1:8000/earnings/


returns earnings* : AreaOfResidence
http://127.0.0.1:8000/earnings/AreaOfResidence/:area'


returns earnings(area,stat,and averge): sex and area
http://127.0.0.1:8000/earnings/:sex/:area


returns earnings(sex, area, stats) : sex, area
http://127.0.0.1:8000/FemaleEarning/:area



returns earnings(sex, area, stats) : sex, area
http://127.0.0.1:8000/MaleEarning/:area


returns earnings(sex, area, stat, average): Stat, sex
http://127.0.0.1:8000/TopEarners/:sex



returns population & earnings(pop.area, earnings.area, sex, ):
http://127.0.0.1:8000/PopEarning/:sex/:province

delete population
http://127.0.0.1:8000//deletePop/:id

delete earnings
http://127.0.0.1:8000/deleteEarning/:id
