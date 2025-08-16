import mongoose from "mongoose"

const foodSchema= new mongoose.Schema({
    product_id:{type:String,required:true,unique:true},
    name:{type:String,trim:true,required:true},
    image:{type:String,required:true},
    price:{type:Number,required:true},
    description:{type:String,required:true},
    category:{type:String,required:true,default:"Salad"}
})

const foodModel= mongoose.models.food || mongoose.model("food",foodSchema)

export default foodModel