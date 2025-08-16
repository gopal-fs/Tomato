import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({

    user_id:{type:String,required:true},
    order_id:{type:String,required:true,unique:true},
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    email:{type:String,required:true},
    street:{type:String,required:true},
    city:{type:String,required:true},
    state:{type:String,required:true},
    pincode:{type:String,required:true},
    country:{type:String,required:true},
    number:{ 
        type:String,
        match:[/^[6-9]\d{9}$/, "Please enter a valid 10-digit phone number"]
      },
      
    user_cart: {type: [
        {product_id:{type:String,required:true},title: String,image: {type:String,required:true},price: Number,quantity: {type:Number,default:1},total: Number}]},
    payment:{type:Boolean,default:false},
    amount_paid:{type:Number,required:true},
    status:{type:String,default:"Food Processing",enu:["Food Processing","Out for delivery","Delivered"]},
    created_at: { type: Date, default: Date.now },
    toast_shown: { type: Boolean, default: false }
})

const orderModel= mongoose.models.order || mongoose.model("order",orderSchema)
export default orderModel