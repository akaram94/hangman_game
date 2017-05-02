var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var bodyParser = require('body-parser');
var fs = require('fs');

app.set( 'port', ( process.env.PORT || 5000 ));
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/assets', express.static('public'));

app.get('/', function(req, res){
    res.render('title');
});

app.get('/game', function(req, res){
    console.log('GET sent from client.');
    console.log('Responding with game data.');
    var data = fs.readFileSync('./public/game_files/word_list.txt');
    res.end(data);
    console.log('Sent data.');

});

app.get('/leaderboards', function(req, res){
    MongoClient.connect("mongodb://admin:123456@ds129031.mlab.com:29031/players", function (err, db) {
   
     if(err) throw err;

     //Write database Insert/Update/Query code here...
     db.collection('users').find().sort({ score: -1 }).limit(10).toArray(function(err, results){
        res.end(JSON.stringify(results));
     });
    });
});

app.post('/', function(req, res){
    console.log('POST sent from client.');
    console.log("Name: " + req.body['name']);
    MongoClient.connect("mongodb://admin:123456@ds129031.mlab.com:29031/players", function (err, db) {
   
     if(err) throw err;

     //Write database Insert/Update/Query code here...
     db.collection('users').update({_id: req.body['name']}, { $inc: { score: 1 }});
     res.send({success:true});
    });
});

app.post('/checkUser', function(req, res){
    console.log('POST sent from client.');
    console.log("Name: " + req.body['name']);
    MongoClient.connect("mongodb://admin:123456@ds129031.mlab.com:29031/players", function (err, db) {

        if(err) throw err;

        db.collection('users').insert({_id: req.body['name'], score: 0});
        console.log('finished');
        res.send({success:true});
    });
});

app.listen( app.get( 'port' ), function() {
  console.log( 'Node server is running on port ' + app.get( 'port' ));
});