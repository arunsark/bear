var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

var router = express.Router();
router.use(function(req, res, next) {
  console.log('something is happening');
  next();
});
router.get('/', function(req,res) {
  res.json({message: 'hooray'});
});

router.get('/example/b', function(req, res, next) {
  console.log('first callback of b');
  next();
}, function(req, res) {
  console.log('second callback of b');
  res.send('hello b');
});

router.route('/bears')
      .post(function(req,res) {
        var bear = new Bear();
        bear.name = req.body.name;
        bear.save(function(err) {
          if(err)
            res.send(err);
          res.json({message: 'Bear created!'});
        })
      })
      .get(function(req,res) {
        Bear.find(function(err, bears) {
          if(err)
            res.send(err);
          res.json(bears);
        });
      });

router.route('/bears/:id')
      .get(function(req,res) {
        Bear.findById(req.params.id, function(err, bear) {
          if (err)
            res.send(err);
          res.json(bear);
        });
      })
      .put(function(req,res) {
        Bear.findById(req.params.id, function(err, bear) {
          if (err)
            res.send(err);
          bear.name = req.body.name;
          bear.save(function(err) {
            if (err)
              res.send(err);
            res.json({message: 'Bear updated!'});
          });
        });
      })
      .delete(function(req,res) {
        Bear.remove({ _id: req.params.id }, function(err, bear) {
          if (err)
            res.send(err);
          res.json({message: 'Bear deleted!'});
        });
      });


app.use('/api', router);


var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/bear');
var Bear = require('./app/models/bear');

var port = process.env.PORT || 8080;
app.listen(port);
console.log('listening on port '+port);
