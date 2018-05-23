const express = require('express');
// const routes = require('./routes');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/dmzon";

var dmzone;
var database;
MongoClient.connect(url, {
	useNewUrlParser: true
}).then(function(db) {
	database = db;
	dmzone = db.db('dmzone');
}).catch((err) => {
	console.log(err);
});

app = express();

// route(app);

app.get('/', (req, res) => {
	
	res.send('hello world')
});
app.get('/getlist', (req, res) => {
	dmzone
	.collection('blog')
	.find({}, {'_id': 0})
	.toArray()
	.then((list) => {
		res.json({
			list,
			greeting: 'hello world'
		});
	});
});

app.listen(3000, function () {
	console.log('server start at prot 3000');
});