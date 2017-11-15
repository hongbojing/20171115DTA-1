/**
 * Created by hongboing on 11/15/17.
 */
//grab the package we need for the user model
var mongoose = require('mongoose');// used to communicate with our MongoDB database
var Schema = mongoose.Schema;//Everything in Mongoose starts with a Schema. Each schema maps to a MongoDB collection and defines the shape of the documents within that collection.
var bcrypt = require('bcrypt-nodejs');//allow us to hash our password

// user schema
var UserSchema = new Schema({
    name: String,
    username: {type: String, required: true, index:{unique:true}},
    password: {type: String, required: true, select: false}
});

// hash the password before the user is saved
UserSchema.pre('save', function (next) {
    var user = this;

    //hash the password only if the password has been changed or user is new
    if(!user.isModified('password')) return next();

    bcrypt.hash(user.password, null, null, function (err, hash) {
        if(err) return next(err);

        //change the password to the hashed version
        user.password = hash;
        next();
    });
});

//method to compare a given password with the database hash
UserSchema.methods.comparePassword = function (password) {
    var user = this;
    return  bcrypt.compareSync(password, user.password);
    // compareSync NOT compare #wocao
};

module.exports = mongoose.model('User', UserSchema);
