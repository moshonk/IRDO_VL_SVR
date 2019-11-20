var express = require('express');
var router = express.Router();

const fs = require('fs');

const FILE_NAME = 'resources/facilities.json';

/* GET home page. */
router.get('/', function (req, res, next) {

  res.render('index', { title: 'Search for Viral Load Results'});

});

module.exports = router;
