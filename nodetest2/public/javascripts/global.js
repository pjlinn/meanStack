// Userlist data array for filling in info box
var userListData = [];

// DOM Ready =====================================
$(document).ready(function() {
	
	// Populate the user table on intial page load
	populateTable();

	// Username link click
	$('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);

	// Add User button click
	$('#btnAddUser').on('click', addUser);

	// Delete User link click
	$('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);

	// Edit User link click
	$('#userList table tbody').on('click', 'td a.linkedituser', editUser);

	// Update/Put Update Info Button
	$('#btnUpdateUserInfo').on('click', updateInfo);

});

// Functions =====================================

// Fill table with data
function populateTable() {

	// Empty content string
	var tableContent = '';

	// jQuery AJAX call for JSON
	$.getJSON( '/users/userlist', function ( data ) {

		// Stick our user data array into a userlist variable in the global object
		userListData = data;

		// For each item in our JSON, add a table row and cells to the content string
		$.each(data, function() {
			tableContent += '<tr>';
			tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.username + '</td>';
			tableContent += '<td>' + this.email + '</td>';
			tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
			tableContent += '<td><a href="#" class="linkedituser" rel="' + this._id + '">edit</a></td>';
			tableContent += '</tr>';
		});

		// Inject the whole content string into our existing HTML table
		$('#userList table tbody').html(tableContent);
	});
};

// Show User info
function showUserInfo(event) {

	// Prevent Link from Firing
	event.preventDefault();

	// Retrieve username from link rel attribute
	var thisUserName = $(this).attr('rel');

	// Get Index of object based on id value
	var arrayPosition = userListData.map(function(arrayItem) { return arrayItem.username; }).indexOf(thisUserName);

	// Get our User Object
	var thisUserObject = userListData[arrayPosition];

	// Populate Info Box
	$('#userInfoName').text(thisUserObject.fullname);
	$('#userInfoAge').text(thisUserObject.age);
	$('#userInfoGender').text(thisUserObject.gender);
	$('#userInfoLocation').text(thisUserObject.location);

};

// Add User
function addUser(event) {
	event.preventDefault();

	// Super basic validation - increase errorCount variable if any fields are blank
	var errorCount = 0;
	$('#addUser input').each(function(index, val) {
		if($(this).val() === '') { errorCount++; }
	});

	// Check and make sure errorCount's still at zero
	if (errorCount === 0) {

		// If it is, compile all user info into one object
		var newUser = {
			'username': $('#addUser fieldset input#inputUserName').val(),
			'email': $('#addUser fieldset input#inputUserEmail').val(),
			'fullname': $('#addUser fieldset input#inputUserFullname').val(),
			'age': $('#addUser fieldset input#inputUserAge').val(),
			'location': $('#addUser fieldset input#inputUserLocation').val(),
			'gender': $('#addUser fieldset input#inputUserGender').val()
		}

		// Use AJAX to post the object to our adduser service
		$.ajax({
			type: 'POST',
			data: newUser,
			url: '/users/adduser',
			dataType: 'JSON'
		}).done(function( response ) {

			// Check for successful (blank) response
			if (response.msg === '') {

				// Clear the form inputs
				$('#addUser fieldset input').val('');

				// Update the table
				populateTable();

			}
			else {

				// If something goes wrong, alert the error message that our service returned
				alert('Error: ' + response.msg);

			}
		});
	}
	else {

		// If errorCount is more than 0, error out
		alert('Please fill in all fields');
		return false;
	}
};


// Delete User
function deleteUser(event) {

	event.preventDefault();

	// Pop up a confirmation dialog
	var confirmation = confirm('Are you sure you want to delete this user?');

	// Check and make sure the user confirmed
	if (confirmation === true) {

		// If they did, do our delete
		$.ajax({
			type: 'DELETE',
			url: '/users/deleteuser/' + $(this).attr('rel')
		}).done(function (response) {

			// Check for a successful (blank) response
			if (response.msg === '') {

			}
			else {
				alert('Error: ' + response.msg);
			}

			// Update the table
			populateTable();

		});
	}
	else {

		// If they said no to the confirm, do nothing
		return false;

	}
};

// Edit User - fills the input fields with current info
function editUser(event) {

	// If this method is called, the default action of the event will not be triggered.
	event.preventDefault;

	// Pulled out the Object _id of the selected person to update
	var id = $(this).attr('rel');

	// jQuery AJAX shorthand, returns the get JSON and uses it to fill the edit form
	$.getJSON('/users/userinfo/' + $(this).attr('rel'), function (data) {
		// Attach the edit rel, to the update rel
		$('#btnUpdateUserInfo').attr('rel', id);
		$('#updateUserName').val(data.username);
		$('#updateEmail').val(data.email);
		$('#updateFullname').val(data.fullname);
		$('#updateAge').val(data.age);
		$('#updateLocation').val(data.location);
		$('#updateGender').val(data.gender);
	});
};

// Update user info
function updateInfo(event) {

	// Prevents defualt functionality
	event.preventDefault;

	// Set the id equal to rel, which is the _id, which is used for the put
	var id = $('#btnUpdateUserInfo').attr('rel');

	// Create an object of data to pass to the PUT call
	var newInfo = {
		'username': $('#updateUser fieldset input#updateUserName').val(),
		'email': $('#updateUser fieldset input#updateEmail').val(),
		'fullname': $('#updateUser fieldset input#updateFullname').val(),
		'age': $('#updateUser fieldset input#updateAge').val(),
		'location': $('#updateUser fieldset input#updateLocation').val(),
		'gender': $('#updateUser fieldset input#updateGender').val()
	}

	// Use ajax to PUT the object into our DB
	$.ajax({
		type: 'PUT',
		data: newInfo,
		url: '/users/putuser/' + id,
		dataType: 'JSON'
	}).done(function (response) {
		if (response.msg === '') {

			// Clear the form
			$('#updateUser fieldset input').val('');

			// Update the table
			populateTable();
		}
		else {

			// If something goes wrong, alert the error message that our service returned
			alert('Error: ' + response.msg);

		};
	});
};










