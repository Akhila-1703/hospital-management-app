import { Schema, model } from "mongoose"

const userSchema = new Schema({

    name:{
        type:String,
        required:[true,"First name is required"]
    },

    email:{
        type:String,
        required:[true,"Email is required"],
        unique:[true,"Email already exists"]
    },

    password:{
        type:String,
        required:[true,"Password is required"]
    },

    profileImageUrl:{
        type:String
    },

    role:{
        type:String,
        enum:["ADMIN","DOCTOR","PATIENT"],
        required:[true,"Role is required"]
    },

    phoneNumber:{
        type:String
    },

    isActive:{
        type:Boolean,
        default:true
    }

},{
    timestamps:true,
    strict:true,
    versionKey:false
})

export const UserTypeModel = model("user", userSchema)