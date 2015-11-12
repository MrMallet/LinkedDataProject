

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
