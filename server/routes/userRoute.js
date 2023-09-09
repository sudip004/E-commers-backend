const express = require("express")
const router = new express.Router()

const {register, Login, Logout, forgotPassword, resetPassword,
     getuserDetails, updatepassword, updateProfile, getAllUsers,
      getsingleUser, updateUserRole, deleteUserRole, createproductReview,
       getproductreviews, deleteReview} = require("../controllers/userController")
       
const {isAuthenticatedUser,authorizeRoles} = require("../middleware/auth")
// For User Register
router.route("/register").post(register)
// For User Login
router.route("/login").post(Login)
// ..For reset password
router.route("/password/forgot").post(forgotPassword)
// ..For Reset paaword $$ Login user
router.route("/password/reset/:token").put(resetPassword)
// For Loged Out
router.route("/logout").get(Logout)
// Get user Details
router.route("/me").get(isAuthenticatedUser,getuserDetails)
// update password
router.route("/password/update").put(isAuthenticatedUser,updatepassword)
//..Update User profile
router.route("/me/update").put(isAuthenticatedUser,updateProfile)
// ..Admin show all users
router.route("/admin/users").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUsers)
// Admin show single user
router.route("/admin/:id").get(isAuthenticatedUser,authorizeRoles("admin"),getsingleUser)
// Admin change Updae user role
router.route("/admin/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateUserRole)
// Delete user by admin
router.route("/admin/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUserRole)
// Create A Review for product
router.route("/review").put(isAuthenticatedUser,createproductReview)
// Review All review for a product
router.route("/review").get(getproductreviews)
// Delete A Product Review
router.route("/review").delete(isAuthenticatedUser,deleteReview)

module.exports=router