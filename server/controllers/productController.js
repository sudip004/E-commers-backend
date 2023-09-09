const product = require("../models/productModel");
const Errorhandler = require("../utils/errorhandler");
const catchasyncerrors = require("../middleware/catchasyncerrors");
const apiFeatures = require("../utils/apifeatures");


// Create product --Admin
exports.createProduct = catchasyncerrors(async (req, res, next) => {

    req.body.user = req.user.id
  const products = await product.create(req.body);

  res.status(201).json({
    success: true,
    products,
  });
});

// GET all product
exports.getAllProduct =catchasyncerrors( async (req, res) => {
  const resultperpage = 10
  const productcount = await product.countDocuments()
  const apiFeature = new apiFeatures(product.find(),req.query).search().filter().pagination(resultperpage)
  const products = await apiFeature.query;
  // console.log(products);
  res.status(200).json({
    success: true,
    products,
    productcount
  });
});

// Get A Single Product

exports.getProduct = catchasyncerrors(async (req, res) => {
 try {
     const productdetails = await product.findById(req.params.id);

     res.status(200).json({
       success: true,
       productdetails,
     });
 } catch (error) {
     res.status(500).json({
          success: false,
          message: 'product not found'
     })
 }
});

// Update Products Deatails --Admin
exports.updateProdect = catchasyncerrors(async (req, res) => {
  let productid = await product.findById(req.params.id);

  if (!product) {
    res.status(404).json({
      success: false,
      message: "Product Not Found",
    });
  }

  productid = await product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  res.status(201).json({
    success: true,
    message: "Product updateed Successfully",
  });
});

// delete A Product

exports.deleteProduct = catchasyncerrors(async (req, res) => {
  let productid = await product.findById(req.params.id);

  if (!productid) {
    res.status(404).json({
      success: false,
      message: "Product Not Found",
    });
  }

  // await product.deleteOne({_id:req.params.id})
  await productid.remove();

  res.status(201).json({
    success: true,
    message: "Product deleted Successfully",
  });
});
