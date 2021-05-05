var mongoose = require('mongoose');
var Schema = mongoose.Schema

var UserSchema = new Schema({
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true }
});

UserSchema.methods.comparePassword = function(enteredPassword, callback){
    if(enteredPassword == this.password)
        callback(null, true);
    else
        callback(null, false);
}
module.exports = mongoose.model('User', UserSchema);