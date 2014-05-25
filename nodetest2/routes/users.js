var express = require('express');
var router = express.Router();

/*
	GET userlist.
*/

router.get('/userlist', function(req, res) {
	var db = req.db;
	db.collection('userlist').find().toArray(function (err, items) {
		res.json(items);
	});
});


/*
	POST to adduser.
*/
router.post('/addUser', function(req, res) {
	var db = req.db;
	db.collection('userlist').insert(req.body, function(err, result) {
		res.send(
			(err === null) ? { msg: '' } : { msg: err }
		);
	});
});

/*
	DELETE to deleteuser
*/
router.delete('/deleteuser/:id', function(req, res) {
	var db = req.db;
	var userToDelete = req.params.id;
	db.collection('userlist').removeById(userToDelete, function(err, result) {
		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
	});
});

/*
	GET for PUT
*/
router.get('/userinfo/:id', function(req, res) {
	var db = req.db;
	var userInfo = req.params.id;
	db.collection('userlist').findById(userInfo, function (err, items) {
		res.json(items);
	});
});

/*
	UPDATE/PUT to putuser
	-- Actually works, probably not optimal
*/
router.put('/putuser/:id', function(req, res) {
	var db = req.db;
	var userToUpdate = req.params.id;

	db.collection('userlist').updateById(userToUpdate, req.body, function (err, result) {
		res.send(
			(err === null) ? {msg: ''} : { msg : err}
		);
	});
});

module.exports = router;
