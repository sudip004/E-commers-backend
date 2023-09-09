const mongoose = require("mongoose");

const Schema = new mongoose.Schema({
  shippingInfo: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    pincode: { type: Number, required: true },
    phoneNo: { type: Number, required: true },
  },

  orderItems:[
    {
        name:{type:String,required:true},
        price:{type:Number,required:true},
        quantity:{type:Number,required:true},
        image:{type:String},
        product:{
            type:mongoose.Schema.ObjectId,
            ref:"product",
            required:true
        }
    }
  ],

  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    required:true
  },
  paymentInfo: {
    id: {
        type: String,
        required:true
    },
    status:{
        type:String,
        required:true
    },
},
    paidAt: {
       type:Date,
       required:true
    },
    itemsprice:{
        type: Number,
        default:0
    },
    textprice:{
        type: Number,
        default:0
    },
    shippingprice:{
        type: Number,
        default:0
    },
    totalprice:{
        type: Number,
        default:0
    },
    orderstatus:{
        type:String,
        default:"processing"
    },
  deliveredAt: Date,
  createdAt: {
    type:Date,
    default:Date.now
  }
});

module.exports =  mongoose.model("Orders", Schema);
