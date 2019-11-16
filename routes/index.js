var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  let facilities = [
    { mfl: 18109, name: 'Tuungane Dice - Bondo' },
    { mfl: 17846, name: 'International Medical Corps Mobile VCT (Mbita)' },
    { mfl: 22173, name: 'Tumaini Dice - Siaya' },
    { mfl: 22392, name: 'Tumaini Dice - Ugunja' },
    { mfl: 20029, name: 'Sindo Dice' },
    { mfl: 18557, name: 'Asembo Dice' }

  ];
  res.render('index', { title: 'Search for Viral Load Results', facilities: facilities });
});

module.exports = router;
