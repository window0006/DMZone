const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
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

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

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
app.get('/addpost', (req, res) => {
	res.render('addpost.ejs', (err, html) => {
		if (err) throw err;
		res.send(html);
	});
});
app.post('/addpost', (req, res) => {
	const blogData = req.body;
	dmzone.collection('blog').save({
		...blogData,
		date: Date.now(),
		author: 'window',
		comments: [],
		tags: []
	});
	res.json({status: 200, msg: 'ok'});
});
app.post('/delpost', () => {

});
app.post('/editpost', () => {

});


app.listen(3000, function () {
	console.log('server start at prot 3000');
});