#!/usr/bin/env node

var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost/homeTheaterComponents', function(err, db) {
	if (err) throw err;
	// console.log("Connected to Database");

	var collection = db.collection('components');

	// collection.count(function(err, count) {
		// console.log("There are " + count + " records.");
	// });

    // collection.find().each(function(err, doc) {
    //   if(doc != null) {
    //   	console.dir(doc);
    //   }
    //   db.close();
    // });

	// collection.find().toArray(function(err, docs) {
	// 	console.log(docs);
	// });

	console.log(collection.find());
})