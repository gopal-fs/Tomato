import { v4 as uuid } from 'uuid';
import cloudinary from '../configs/cloudinary.js';
import foodModel from '../models/ProductsSchema.js';
import orderModel from '../models/OrdersSchema.js';



export const getFood=async(req,res)=>{
  try{
     const food_data=await foodModel.find({})
     return res.status(200).send(food_data)
  }
  catch(err){
    return res.status(500).send(err.message)
  }

}


export const addFood = async (req, res) => {
  try {
    const product_id = uuid();

    
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "profiles" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const product = {
      ...req.body,
      price: Number(req.body.price),
      image: result.secure_url
    };

    const newProduct = new foodModel({
      product_id,
      ...product
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    console.error("Error in addFood:", err);
    res.status(500).json({ error: err.message });
  }
};

export const removeFood=async(req,res)=>{

  try{
    const {product_id}=req.body

    const findProduct = await foodModel.findOneAndDelete({product_id})

    if(findProduct){
      return res.status(200).send("Product Removed Succesfully")
    }

    return res.status(404).send("Product Not Found")
    

  }

  catch(err){
    return res.status(500).send(err.message)
  }
 

}


export const updateStatus = async (req, res) => {
  const { status, order_id } = req.body;
 

  if (!status || !order_id) {
    return res.status(400).send({ success: false, message: "Order ID and status are required" });
  }

  try {
   

    
    const updatedOrder = await orderModel.findByIdAndUpdate(
      order_id,
      { $set: { status } },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).send({ success: false, message: "Order Not Found" });
    }

    return res.status(200).send({
      success: true,
      message: "Status Changed Successfully!",
      order: updatedOrder
    });
  } catch (err) {
   
    return res.status(500).send({ success: false, message: "Something went wrong" });
  }
};
