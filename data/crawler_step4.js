// Run in node.js
var readlineSync = require('readline-sync');
var jsonfile = require('jsonfile');
var fs = require('fs');
var companies = JSON.parse(fs.readFileSync('fortune_500.json', 'utf8'));

// This step is manual

var count = 0;
companies.forEach(function(company) {
    if(company.city_lon == undefined) {
        console.log(company.city_name + ", " + company.city_state);
        count += 1;
    }
});

console.log("Total cities: " + count);

companies.forEach(function(company) {
    if(company.city_lon == undefined) {
        while(1) {
            var lat;
            var lon;

            var userInput = readlineSync.question(company.city_name + ", " + company.city_state + " ");

            lat = parseFloat(userInput.split(",")[0]);
            lon = parseFloat(userInput.split(",")[1]);

            if(lat && lon) {
                console.log("Lat: " + lat + " Lon: " +lon);
                company.city_lat = lat;
                company.city_lon = lon;
                break;
            }
            else {
                console.log("Error!!!");
            }
        }
        count -= 1;
        console.log("Remaining: " + count);
    }
});

console.log(companies);

JSON.stringify(companies);

jsonfile.writeFile('crawler4_output.json', companies, function (err) {
    console.error(err);
});
