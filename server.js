var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var app = express();

app.use(bodyParser.json());
mongoose.connect('mongodb://localhost/1955');
mongoose.Promise = global.Promise;

var oldPersonSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 4}
}, {timestamps: true});

mongoose.model('People', oldPersonSchema);
var Person = mongoose.model('People');

app.get('/', function(req, res) {
    Person.find({}, function(err, people) {
        if (err) {
            console.log(err);
            res.json({message: 'Error', error: err});
        } else {
            res.json({message: 'Success', data: people});
        }
    })
})

app.get('/new/:name', function(req, res) {
    let newPerson = new Person({
        name: req.params.name
    });
    newPerson.save(function(err) {
        if (err) {
            console.log('failed to save', err);
            res.json({message: 'Failed to Save', error: err});
        } else {
            console.log('saved successfully');
            res.send('Added ' + req.params.name + ' to the DB!');
        }
    });
})

app.get('/:name', function(req, res) {
    Person.findOne({name: req.params.name}, function(err, person) {
        if (err) {
            console.log(err);
            res.json({message: 'Error', error: err});
        } else {
            res.json({message: 'Success', data: person});
        }
    })
})

app.get('/remove/:name', function(req, res) {
    Person.remove({name: req.params.name}, function (err) {
        if (err) {
            console.log(err);
            res.json({message: 'Error', error: err});
        } else {
            res.send('Successfully deleted ' + req.params.name + ' from the DB!');
        }
    })
})

app.listen(8000, function() {
    console.log('listening on port 8000');
})