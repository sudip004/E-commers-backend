const express = require("express")
const Order = require("../models/orderModels")
const catchasyncerrors = require("../middleware/catchasyncerrors");
const product = require("../models/productModel");


// Create Order

exports.newOrder = async (req,res,next) => {
    try {
        
      const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsprice,
        textprice,
        shippingprice,
        totalprice
      } = req.body

     const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsprice,
        textprice,
        shippingprice,
        totalprice,
        paidAt:Date.now(),
        user:req.user._id,
     })

     res.status(201).json({
        success:true,
        order
     })

    } catch (error) {
      console.log(error);  
    }
}

// Get Single Order
exports.getSingleOrder = async (req,res,next) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )
    if(!order){
        res.status(404).json({
            success:false,
            message:"Order not found with this user"
        })
    }

    res.status(200).json({
        success:true,
        order
    })
}

// Get logedin user order
exports.myOrders = async (req,res,next) => {
    const orders = await Order.find({user: req.user._id})

    res.status(200).json({
        success:true,
        orders
    })
}

// Get all orders --admin
exports.GetAllOrders = async (req,res,next) => {
    const orders = await Order.find()

    let totalAmount=0;
           orders.forEach(order=>{
            totalAmount+=order.totalprice
           })

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
}

// Update order status --admin
exports.updateOrdersStatus = async (req,res,next) => {
    const order = await Order.findById(req.params.id)

        if(!order){
            res.status(404).json({
                success:false,
                message:"order not founf in update order"
            })
            return next()
        }

       if(order.orderstatus === "Deliverd"){
        res.status(404).json({
            message:"You have alredy delevered this order"
        })
        return next()
       }
     order.orderItems.forEach(async(order)=>{
         updateStock(order.product,order.quantity)
     })
    
     order.orderstatus = req.body.status

     if(req.body.status=== "Delivered"){
        order.deliveredAt=Date.now()
     }
      
     await order.save({validateBeforeSave:false})
    res.status(200).json({
        success:true,
       
    })
}

async  function updateStock(id,quantity){
const productfind = await product.findById(id)

productfind.Stock-=quantity

await productfind.save({validateBeforeSave:false})
}

// Delete Order --Admin
exports.deleteOrder = async (req,res,next) => {
    try {
        
     const order = await Order.findById(req.params.id)
     if(!order){
        res.status(404).json({
            message:"order not found so not to delete"
        })
        return next()
     }
     await order.remove()

     res.status(200).json({
        success:true,
        message:"successfully delete order"
     })

    } catch (error) {
        console.log(error);
    }
}