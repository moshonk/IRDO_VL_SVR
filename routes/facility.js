var express = require('express');
var router = express.Router();

const fs = require('fs');

const FILE_NAME = 'resources/facilities.json';

let facilities = [];

/* GET home page. */
router.get('/', function (req, res, next) {

    if (facilities.length == 0) {
        fs.readFile(FILE_NAME, (error, data) => {
            console.log('Async Read: starting...');
    
            if (error) {
                // if there is an error, print it
                console.log('Async Read: NOT successful!');
                console.log(error);
            } else {
                try {
                    // try to parse the JSON data
                    const dataJson = JSON.parse(data);
                    facilities = dataJson;
                    res.send(facilities);
    
                    console.log('Async Read: successful!');
                } catch (error) {
                    // else print an error (e.g. JSON was invalid)
                    console.log(error);
                }
            }
        });            
    } else {
        let searchTerm = req.query.searchTerm;
        if (searchTerm != undefined) {
            searchTerm = searchTerm.toLowerCase();
            let filteredFacilities = facilities.filter((f) => {
                return (f.facility.toLowerCase().includes(searchTerm) || f.facilityMFLCode == searchTerm);
            });
        
            res.send(filteredFacilities);    
        } else {
            res.send(facilities);
        }
    }

});

module.exports = router;
