const express = require("express");
const router = express.Router();
const User = require("../models/user");
const multer = require("multer");
const fs = require("fs");
// -------------------- Multer Config --------------------
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads"); // upload folder
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }); // keep as Multer instance

// -------------------- Routes --------------------

// Insert a user
router.post("/add-user", upload.single("image"), async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: req.file ? req.file.filename : null,
    });

    await user.save();
    req.session.message = {
      type: "success",
      message: "User added successfully!",
    };

    res.redirect("/");
  } catch (error) {
    console.error(error);
    req.session.message = {
      type: "danger",
      message: "Failed to add user.",
    };
    res.redirect("/add-user");
  }
});

// Render Home
// Render Home
router.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.render("index", {
      title: "Home Page",
      users: users,
    });
  } catch (err) {
    res.json({ message: err.message });
  }
});
// edit user route
router.get("/edit/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const user = await User.findById(id);

    if (!user) {
      return res.redirect("/");
    }

    res.render("edit_users", {
      title: "Edit User",
      user: user,
    });
  } catch (err) {
    console.error(err);
    res.redirect("/");
  }
});
// update user route
// update user route
router.post("/update/:id", upload.single("image"), async (req, res) => {
  try {
    let id = req.params.id;
    let new_image = "";

    if (req.file) {
      // new file uploaded → replace with new file
      new_image = req.file.filename;

      // delete old image (optional cleanup)
      if (req.body.old_image) {
        try {
          fs.unlinkSync("./uploads/" + req.body.old_image);
        } catch (err) {
          console.log("Could not delete old image:", err.message);
        }
      }
    } else {
      // no new file chosen → keep old one
      new_image = req.body.old_image;
    }

    // update user
    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      image: new_image,
    });

    req.session.message = {
      type: "success",
      message: "User updated successfully!",
    };
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to update user.",
    };
    res.redirect("/");
  }
});

// Render Add User Form
router.get("/add-user", (req, res) => {
  res.render("add_users", { title: "Add Users" });
});
// delete user routes
router.get("/delete/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const result = await User.findByIdAndDelete(id);

    if (result && result.image) {
      try {
        fs.unlinkSync("./uploads/" + result.image);
      } catch (error) {
        console.log("Failed to delete image:", error.message);
      }
    }

    req.session.message = {
      type: "success",
      message: "User deleted successfully!",
    };
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.session.message = {
      type: "danger",
      message: "Failed to delete user!",
    };
    res.redirect("/");
  }
});

module.exports = router;
