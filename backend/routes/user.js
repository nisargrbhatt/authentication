const express = require("express");

const userControllers = require("../controllers/user");
const file = require("../middlewares/file");
const checkAuth = require("../middlewares/check-auth");

const router = express.Router();

router.post("/createuser", userControllers.createUser);
router.post("/userlogin", userControllers.userLogin);
router.put("/setphoto", checkAuth, file, userControllers.setPhoto);
router.get("/checkemail/:email", userControllers.checkEmail);
router.get("/checkusername/:username", userControllers.checkUsername);
router.put("/resetpassword", checkAuth, userControllers.passwordReset);
router.put("/setprofile", checkAuth, userControllers.setProfile);
router.get("/getuser", checkAuth, userControllers.getUserProfile);
router.get("/getuserdata", checkAuth, userControllers.getUserData);

module.exports = router;
