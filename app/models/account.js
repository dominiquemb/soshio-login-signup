// app/models/account.js
// load the things we need
var mongoose = require('mongoose');

// define the schema for our user model
var accountSchema = mongoose.Schema({
	accountName: String,
	plan: String,
	permissions: Array,
	variablelimit: String,
	nolimit: Boolean,
	paymentschedule: String,
	token: String,
	planFee: Number
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Account', accountSchema);
