const express = require("express")
const router = new express.Router()

const {newOrder, getSingleOrder, myOrders, GetAllOrders, updateOrdersStatus, deleteOrder} = require("../controllers/orderController")
const {isAuthenticatedUser, authorizeRoles} = require("../middleware/auth")

// Create new Order
router.route("/order/new").post(isAuthenticatedUser,newOrder)
// Get singleorder  
router.route("/order/:id").get(isAuthenticatedUser,getSingleOrder)
// logesin user show her all orders
router.route("/order/me").post(isAuthenticatedUser,myOrders)
// Get All Orders --Admin
router.route("/admin/orders").get(isAuthenticatedUser,authorizeRoles("admin"),GetAllOrders)
// Update order status --admin
router.route("/admin/order/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateOrdersStatus)
// delete order status
router.route("/admin/order/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteOrder)

module.exports = router