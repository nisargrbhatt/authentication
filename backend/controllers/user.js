const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.createUser = async (req, res, next) => {
  let resObj = {
    status: undefined,
    response: {
      message: undefined,
      success: true,
      data: undefined,
      error: undefined,
    },
  };
  try {
    const hash = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      name: req.body.name,
      username: req.body.username,
      email: req.body.email,
      password: hash,
      photo: "http://localhost:3000/images/default.png",
    });
    let saveResult = await user.save();
    resObj.status = 200;
    resObj.response.message = "OK";
    resObj.response.success = true;
    resObj.response.data = saveResult;
    resObj.response.error = null;
  } catch (error) {
    console.log(error);
    resObj.status = 500;
    resObj.response.message = "Something went wrong!";
    resObj.response.success = false;
    resObj.response.data = null;
    resObj.response.error = error.stack;
  } finally {
    next(resObj);
  }
};

exports.userLogin = async (req, res, next) => {
  let resObj = {
    status: undefined,
    response: {
      message: undefined,
      success: true,
      data: undefined,
      error: undefined,
    },
  };
  try {
    let user = await User.findOne({
      email: req.body.email,
    });
    if (!user) {
      resObj.status = 401;
      resObj.response.message = "Invalid Authentication Credentials";
      resObj.response.success = false;
      resObj.response.data = null;
      resObj.response.error = null;
      next(resObj);
    }
    let passwordCompare = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordCompare) {
      resObj.status = 401;
      resObj.response.message = "Invalid Authentication Credentials";
      resObj.response.success = false;
      resObj.response.data = null;
      resObj.response.error = null;
      next(resObj);
    }
    const token = jwt.sign(
      {
        email: user.email,
        userId: user._id,
      },
      process.env.JWT_KEY,
      { expiresIn: "24h" }
    );
    let userUpdateResult = await User.updateOne(
      { _id: user._id },
      {
        last_login: Date.now(),
      }
    );
    resObj.status = 200;
    resObj.response.message = "Logged In Successfully";
    resObj.response.data = {
      token: token,
      expiresIn: 86400,
      userId: user._id,
      last_login: user.last_login,
      profile_setup: user.profile_setup,
    };
    resObj.response.success = true;
    resObj.response.error = null;
  } catch (error) {
    console.log(error);
    resObj.status = 500;
    resObj.response.message = "Something went wrong!";
    resObj.response.success = false;
    resObj.response.data = null;
    resObj.response.error = error.stack;
  } finally {
    next(resObj);
  }
};

exports.setPhoto = async (req, res, next) => {
  let resObj = {
    status: undefined,
    response: {
      message: undefined,
      success: true,
      data: undefined,
      error: undefined,
    },
  };
  try {
    let imagePath = req.body.photo;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    let userupdateResult = await User.updateOne(
      { _id: req.userData.userId },
      {
        photo: imagePath,
        updated_at: Date.now(),
      }
    );
    if (userupdateResult.n > 0) {
      resObj.status = 200;
      resObj.response.message = "Photo Updated Successfully";
      resObj.response.success = true;
      resObj.response.data = null;
      resObj.response.error = null;
    } else {
      resObj.status = 401;
      resObj.response.message = "Not Authorized";
      resObj.response.success = false;
      resObj.response.data = null;
      resObj.response.error = "You are not Authorized";
    }
  } catch (error) {
    console.log(error);
    resObj.status = 500;
    resObj.response.message = "Something went wrong!";
    resObj.response.success = false;
    resObj.response.data = null;
    resObj.response.error = error.stack;
  } finally {
    next(resObj);
  }
};

exports.checkEmail = (req, res, next) => {
  let emailData;
  User.find()
    .then((users) => {
      emailData = users.map((data) => {
        return data.email;
      });
    })
    .then(() => {
      if (emailData.includes(req.params.email)) {
        return res.status(200).json({
          ok: false,
        });
      } else {
        return res.status(200).json({
          ok: true,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Emails!!!",
      });
    });
};

exports.checkUsername = (req, res, next) => {
  let usernameData;
  User.find()
    .then((users) => {
      usernameData = users.map((data) => {
        return data.username;
      });
    })
    .then(() => {
      if (usernameData.includes(req.params.username)) {
        return res.status(200).json({
          ok: false,
        });
      } else {
        return res.status(200).json({
          ok: true,
        });
      }
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        message: "Couldn't fetch Usernames!!!",
      });
    });
};

exports.passwordReset = async (req, res, next) => {
  let resObj = {
    status: undefined,
    response: {
      message: undefined,
      success: true,
      data: undefined,
      error: undefined,
    },
  };
  try {
    let user = await User.findById(req.userData.userId);
    if (!user) {
      resObj.status = 400;
      resObj.response.message = "Bad Request/Bad Data";
      resObj.response.success = false;
      resObj.response.data = null;
      resObj.response.error = "Bad Request/Bad Data";
      next(resObj);
    }
    let passwordCompare = await bcrypt.compare(
      req.body.oldpassword,
      user.password
    );
    if (!passwordCompare) {
      resObj.status = 401;
      resObj.response.message = "Invalid Authentication Credentials";
      resObj.response.success = false;
      resObj.response.data = null;
      resObj.response.error = null;
      next(resObj);
    }
    const hash = await bcrypt.hash(req.body.newpassword, 10);
    let userUpdateResult = await User.updateOne(
      { _id: req.userData.userId },
      {
        password: hash,
        updated_at: Date.now(),
      }
    );
    if (userUpdateResult.n > 0) {
      resObj.status = 200;
      resObj.response.message = "Password Changed Successfully";
      resObj.response.success = true;
      resObj.response.data = null;
      resObj.response.error = null;
    } else {
      resObj.status = 401;
      resObj.response.message = "Not Authorized";
      resObj.response.success = false;
      resObj.response.data = null;
      resObj.response.error = "You are not Authorized";
    }
  } catch (error) {
    console.log(error);
    resObj.status = 500;
    resObj.response.message = "Something went wrong!";
    resObj.response.success = false;
    resObj.response.data = null;
    resObj.response.error = error.stack;
  } finally {
    next(resObj);
  }
};

exports.setProfile = async (req, res, next) => {
  let resObj = {
    status: undefined,
    response: {
      message: undefined,
      success: true,
      data: undefined,
      error: undefined,
    },
  };
  try {
    let userUpdateResult = await User.updateOne(
      {
        _id: req.userData.userId,
      },
      {
        name: req.body.name,
        gender: req.body.gender,
        contact_no: req.body.contact_no,
        address: req.body.address,
        profile_setup: true,
      }
    );
    if (userUpdateResult.n > 0) {
      resObj.status = 200;
      resObj.response.message = "Profile Setup Successfully";
      resObj.response.success = true;
      resObj.response.data = null;
      resObj.response.error = null;
    } else {
      resObj.status = 401;
      resObj.response.message = "Not Authorized";
      resObj.response.success = false;
      resObj.response.data = null;
      resObj.response.error = "You are not Authorized";
    }
  } catch (error) {
    console.log(error);
    resObj.status = 500;
    resObj.response.message = "Something went wrong!";
    resObj.response.success = false;
    resObj.response.data = null;
    resObj.response.error = error.stack;
  } finally {
    next(resObj);
  }
};

exports.getUserProfile = async (req, res, next) => {
  let resObj = {
    status: undefined,
    response: {
      message: undefined,
      success: true,
      data: undefined,
      error: undefined,
    },
  };
  try {
    let user = await User.findById(req.userData.userId);
    if (!user) {
      resObj.status = 400;
      resObj.response.message = "Bad Request/Bad Data";
      resObj.response.success = false;
      resObj.response.data = null;
      resObj.response.error = "Bad Request/Bad Data";
      next(resObj);
    }
    resObj.status = 200;
    resObj.response.message = "User fetched Successfully";
    resObj.response.success = true;
    resObj.response.data = user.map((data) => {
      return {
        name: data.name,
        username: data.username,
        email: data.email,
        photo: data.photo,
        gender: data.gender,
        contact_no: data.contact_no,
        address: data.address,
        last_login: data.last_login,
        updated_at: data.updated_at,
      };
    });
    resObj.response.error = null;
  } catch (error) {
    console.log(error);
    resObj.status = 500;
    resObj.response.message = "Something went wrong!";
    resObj.response.success = false;
    resObj.response.data = null;
    resObj.response.error = error.stack;
  } finally {
    next(resObj);
  }
};

exports.getUserData = async (req, res, next) => {
  let resObj = {
    status: undefined,
    response: {
      message: undefined,
      success: true,
      data: undefined,
      error: undefined,
    },
  };
  try {
    let user = await User.findById(req.userData.userId);
    resObj.status = 200;
    resObj.response.message = "User Data fetched Successfully";
    resObj.response.success = true;
    resObj.response.data = {
      last_login: user.last_login,
      profile_setup: user.profile_setup,
    };
    resObj.response.error = null;
  } catch (error) {
    console.log(error);
    resObj.status = 500;
    resObj.response.message = "Something went wrong!";
    resObj.response.success = false;
    resObj.response.data = null;
    resObj.response.error = error.stack;
  } finally {
    next(resObj);
  }
};
