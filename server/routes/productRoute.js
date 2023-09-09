const express = require("express")

const router = new express.Router()

// require file path
const {getAllProduct,createProduct,updateProdect,deleteProduct,getProduct}=require("../controllers/productController")
const { isAuthenticatedUser,authorizeRoles } = require("../middleware/auth")


router.get('/products',getAllProduct)
router.route('/product/:id').get(isAuthenticatedUser,getProduct)
router.route('/admin/products/new').post(isAuthenticatedUser,authorizeRoles("admin"),createProduct)
router.route('/admin/product/:id').put(isAuthenticatedUser,authorizeRoles("admin"),updateProdect)
router.route('/admin/product/:id').delete(isAuthenticatedUser,authorizeRoles("admin"),deleteProduct)

module.exports=router