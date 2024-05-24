const mongoose = require('mongoose');

const userSchema  = mongoose.Schema({
 fullName :{type: String, required:true},
 email :{type: String, required:true},
 phoneNumber :{type: String, required:true},
 eventSession :{type: String, required:true},



},{
    versionKey:false
})


const UserModel = mongoose.model("recipents" , userSchema)
   module.exports={UserModel}