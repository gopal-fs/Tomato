import orderModel from "../models/OrdersSchema.js";
import foodModel from "../models/ProductsSchema.js"
import userModel from "../models/UserSchema.js"
import express from "express";
import Stripe from "stripe";
import {v4 as uuid} from 'uuid'
const stripe=new Stripe(process.env.STRIPE_SECRET_KEY)


export const addUser=async(req,res)=>{

    try{
        
        const {user_id,user_profile,user_name,user_email,user_cart}=req.body 
        const findUser= await userModel.findOne({user_id})

        if(!findUser){
            const onAppednUser= new userModel({user_id,user_profile,user_name,user_email,user_cart: user_cart || []})
            await onAppednUser.save()
            return res.status(200).send("User Added")
        }
        
        return res.status(200).send("User already exists");
    }
    catch(err){
        return res.status(400).send(err.message)
    }
}

export const getUser= async(req,res)=>{
    const {user_id}=req.body
    

    try{
        const findUser= await userModel.findOne({user_id})
        if(findUser){
            return res.status(200).send({success:true,findUser:findUser})

        }

        return res.status(400).send("User Not Found")
    }
    catch(err){
        return res.status(400).send("User Not Found")
    }
}


export const onAddCartProducts= async(req,res)=>{
    const {user_id,cart_product}=req.body

    try{
        const findUser= await userModel.findOne({user_id})
        if(findUser){
            const updateUserData=await userModel.findOneAndUpdate({user_id},{$push:{user_cart:cart_product}},{new:true})

            return res.status(200).send(`${cart_product.title} Added to Cart`)
        }

        return res.status(400).send("User Not Found")
    }
    catch(err){
        return res.status(500).send(err.message)
    }



}


export const onRemoveCartItem = async (req, res) => {
    try {
        const { user_id, product_id } = req.body;

        const updatedUser = await userModel.findOneAndUpdate(
            { user_id },
            { $pull: { user_cart: { product_id: product_id } } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send("User Not Found");
        }

        return res.status(200).json({
            message: "Item removed from cart",
            user_cart: updatedUser.user_cart
        });
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

export const updateQuantity=async(req,res)=>{
    try {
        const { user_id, product_id, action } = req.body;
    
        const user = await userModel.findOne({ user_id });
        if (!user) return res.status(404).send("User Not Found");
    
        
        const productIndex = user.user_cart.findIndex(p => p.product_id === product_id);
        if (productIndex === -1) return res.status(404).send("Product not found in cart");
    
        
        if (action === "inc") {
          user.user_cart[productIndex].quantity += 1;
        } else if (action === "dec" && user.user_cart[productIndex].quantity > 1) {
          user.user_cart[productIndex].quantity -= 1;
        }
    
        
        user.user_cart[productIndex].total = user.user_cart[productIndex].price * user.user_cart[productIndex].quantity;
    
        await user.save();
    
        return res.status(200).json({ 
          message: "Cart updated successfully", 
          user_cart: user.user_cart 
        });
    
      } catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
      }
}


export const placeOrder = async (req, res) => {
  try {
    const { delivery_address, cart_data, couponApplied } = req.body;

    const total = cart_data.reduce((sum, item) => sum + item.price * item.quantity, 0);

    let fee = 0;
    if (total < 300) fee = 20;
    else if (total >= 300 && total <= 1000) fee = 30;
    else fee = 50;

    let adjustedFee = fee;
    if (couponApplied) {
      adjustedFee = Math.max(0, fee - 20);
    }

    const line_items = cart_data.map((data) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: data.title,
          images: [data.image],
        },
        unit_amount: Math.round(data.price * 100),
      },
      quantity: data.quantity,
    }));

    // Delivery fee item
    if (adjustedFee > 0) {
      line_items.push({
        price_data: {
          currency: "inr",
          product_data: { name: "Delivery Fee" },
          unit_amount: adjustedFee * 100,
        },
        quantity: 1,
      });
    }

    // Save order in DB first
    const order_id = uuid();
    const newOrder = new orderModel({
      ...delivery_address,
      order_id,
      user_cart: cart_data,
      amount_paid: total+adjustedFee
    });
    await newOrder.save();

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `http://localhost:5173/myorders?success=true&order_id=${order_id}`,
      cancel_url: `http://localhost:5173/cart?canceled=true&order_id=${order_id}`,
    });

    res.json({ id: session.id, success: true });
  } catch (err) {
    console.log(err)
    if (err.name === "ValidationError") {
      const firstError = Object.values(err.errors)[0].message;
      return res.status(400).send(firstError);
    }
    return res.status(500).send(err.message || "Something went wrong");
  }
};


export const deleteOrderDetails=async(req,res)=>{
    try{
        const {order_id}=req.body
        const findOrder=await orderModel.findOneAndDelete({order_id:order_id})
        if(!findOrder){
            return res.send(400).send('Order Not Found')
        }
        return res.status(200).send("Order Deleted Succesfully")

    }
    catch(err){
        return res.status(500).send(err.message)
    }
    
}

export const deleteCart=async (req,res)=>{
    try{
        const {user_id}=req.body
        const findUser=await userModel.findOneAndUpdate({user_id:user_id},{user_cart:[]},{new:true})
        if(!findUser){
            return res.status(400).send('User Not Found')
        }
        return res.json({ success: true });

    }
    catch(err){
        return res.status(500).send('Something went Wrong')
    }
}


export const myOrders = async (req, res) => {
    try {
      const { order_id, user_id } = req.query;
  
    
      if (order_id) {
        const order = await orderModel.findOne({ order_id });
  
        let showToast = false;
        if (order && !order.toast_shown) {
          showToast = true;
          order.toast_shown = true;
          await order.save();
        }
  
        return res.json({ order, showToast });
      }
  
      let orders;
      if (user_id) {
      
        orders = await orderModel.find({ user_id }).sort({ created_at: -1 });
      } else {
        
        orders = await orderModel.find({}).sort({ created_at: -1 });
      }
      return res.json({ orders });
    } catch (err) {
      console.log(err);
      return res.status(500).send("Something went wrong");
    }
  };
  