import mongoose from "mongoose";


const userSchema= new mongoose.Schema({
    user_id:{type:String,required:true,unique:true},
    user_profile:{type:String},
    user_name:{type:String,required:true},
    user_email:{type:String,required:true,unique:true},
    user_cart: {type: [
        {product_id:{type:String,required:true},title: String,image: {type:String,required:true},price: Number,quantity: {type:Number,default:1},total: Number}],default: []}
},{minimize:false})
const userModel= mongoose.models.user || mongoose.model("user",userSchema)

export default userModel