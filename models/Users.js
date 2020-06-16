const mongoose=require('mongoose');
 
const UserSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now()
    },
    mobile:{
        type:Number,
        required:true
    },
    worksknown:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true
    },
    active:{
        type:String,
        required:true
    },
    coverImage:{  
        type:Buffer,   //image is sent as base 64 string 
        required:true
    },
    coverImageType:{
        type:String,
        required:true
    }
});

UserSchema.virtual('coverImagePath').get(function() {
    if(this.coverImage !=null && this.coverImageType !=null){
        return `data:${this.coverImageType};charset=utf-8;base64,${this.coverImage.toString('base64')}`
    }
})

const User=mongoose.model('User',UserSchema);

module.exports=User;