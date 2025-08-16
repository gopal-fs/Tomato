import express from 'express'
import { addUser, deleteCart, deleteOrderDetails, getUser, myOrders, onAddCartProducts, onRemoveCartItem, placeOrder, updateQuantity } from '../controllers/UserController.js'

const userRouter= express.Router()

userRouter.post('/addUser',addUser)
userRouter.post('/getUser',getUser)
userRouter.post('/onAddCart',onAddCartProducts)
userRouter.post('/onUpdateCart',onRemoveCartItem)
userRouter.post('/updateQuantity',updateQuantity)
userRouter.post('/placeOrder',placeOrder)
userRouter.post('/deleteOrder',deleteOrderDetails)
userRouter.get("/myorders",myOrders)
userRouter.post('/deleteCart',deleteCart)

export default userRouter