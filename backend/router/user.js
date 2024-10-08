//user.js

const express = require("express");

const { zodSchemaForSignin } = require("../Schema");
const { zodSchema } = require("../Schema");
const { zodSchemaForUpdate } = require("../Schema");
const { User } = require("../db");
const { Account } = require("../db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { authMiddleware } = require("../middleware");

const router = express.Router();

router.get("/", function (req, res) {
  res.send("This is the User page");
});

/////////////////////////////////////////////////////////  Signup    ////////////////////////////////////////////////////////////////////////////
router.post("/signup", async function (req, res) {
  // Auth Check using zod
  const result = zodSchema.safeParse(req.body);

  if (!result.success) {
    console.error("Validation failed:", result.error.errors);
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors,
    });
  }

  console.log("Validation successful:", result.data);

  try {
    // Check if user already exists in the database
    console.log("Querying for userName:", result.data.userName);

    const existingUser = await User.findOne({
      userName: result.data.userName,
    });

    console.log("Existing user:", existingUser);

    if (existingUser) {
      return res.status(409).json({
        message: "Username already taken",
      });
    }

    // Create new user
    const newUser = new User(result.data);
    await newUser.save();

    console.log("User created:", newUser);

    // Create an account for the new user with an initial balance
    const newAccount = new Account({
      userId: newUser._id,
      balance: Math.floor(1 + Math.random() * 10000), // Initial balance, can be adjusted as needed
    });
    await newAccount.save();

    console.log("Account created for user:", newAccount);

    const token = jwt.sign(
      { userName: result.data.userName },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    return res.status(201).json({
      message: "User and account created successfully",
      user: newUser,
      account: newAccount,
      token: token,
    });
  } catch (error) {
    console.error("Error in user creation:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

/////////////////////////////////////////////////////////  Signin   //////////////////////////////////////////////////////////////////////////////

router.post("/signin", async function (req, res) {
  const result = zodSchemaForSignin.safeParse(req.body);
  if (!result.success) {
    console.error("Validation failed:", result.error.errors);
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.errors,
    });
  }

  console.log("Validation successful:", result.data);

  const user = await User.findOne({
    userName: req.body.userName,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        userName: user.userName,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token: token,
    });
    console.log("token sent " + token);
    return;
  }

  res.status(401).json({
    message: "Invalid username or password",
  });
});

/////////////////////////////////////////////////////////  Update   /////////////////////////////////////////////////////////////////////////////

router.put("/update", authMiddleware, async (req, res) => {
  const result = zodSchemaForUpdate.safeParse(req.body);

  if (!result.success) {
    console.error("Validation failed:", result.error.errors);
    return res.status(401).json({
      message: "Validation failed",
      errors: result.error.errors,
    });
  }

  try {
    //user.js

    const express = require("express");

    const { zodSchemaForSignin } = require("../Schema");
    const { zodSchema } = require("../Schema");
    const { zodSchemaForUpdate } = require("../Schema");
    const { User } = require("../db");
    const { Account } = require("../db");
    const mongoose = require("mongoose");
    const jwt = require("jsonwebtoken");
    require("dotenv").config();
    const { authMiddleware } = require("../middleware");

    const router = express.Router();

    router.get("/", function (req, res) {
      res.send("This is the User page");
    });

    /////////////////////////////////////////////////////////  Signup    ////////////////////////////////////////////////////////////////////////////
    router.post("/signup", async function (req, res) {
      // Auth Check using zod
      const result = zodSchema.safeParse(req.body);

      if (!result.success) {
        console.error("Validation failed:", result.error.errors);
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.errors,
        });
      }

      console.log("Validation successful:", result.data);

      try {
        // Check if user already exists in the database
        console.log("Querying for userName:", result.data.userName);

        const existingUser = await User.findOne({
          userName: result.data.userName,
        });

        console.log("Existing user:", existingUser);

        if (existingUser) {
          return res.status(409).json({
            message: "Username already taken",
          });
        }

        // Create new user
        const newUser = new User(result.data);
        await newUser.save();

        console.log("User created:", newUser);

        // Create an account for the new user with an initial balance
        const newAccount = new Account({
          userId: newUser._id,
          balance: Math.floor(1 + Math.random() * 10000), // Initial balance, can be adjusted as needed
        });
        await newAccount.save();

        console.log("Account created for user:", newAccount);

        const token = jwt.sign(
          { userName: result.data.userName },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        return res.status(201).json({
          message: "User and account created successfully",
          user: newUser,
          account: newAccount,
          token: token,
        });
      } catch (error) {
        console.error("Error in user creation:", error);
        res.status(500).json({
          message: "Internal server error",
        });
      }
    });

    /////////////////////////////////////////////////////////  Signin   //////////////////////////////////////////////////////////////////////////////

    router.post("/signin", async function (req, res) {
      const result = zodSchemaForSignin.safeParse(req.body);
      if (!result.success) {
        console.error("Validation failed:", result.error.errors);
        return res.status(400).json({
          message: "Validation failed",
          errors: result.error.errors,
        });
      }

      console.log("Validation successful:", result.data);

      const user = await User.findOne({
        userName: req.body.userName,
        password: req.body.password,
      });

      if (user) {
        const token = jwt.sign(
          {
            userName: user.userName,
          },
          process.env.JWT_SECRET,
          { expiresIn: "1h" }
        );

        res.json({
          token: token,
        });
        console.log("token sent " + token);
        return;
      }

      res.status(411).json({
        message: "Error while logging in",
      });
    });

    /////////////////////////////////////////////////////////  Update   /////////////////////////////////////////////////////////////////////////////

    router.put("/update", authMiddleware, async (req, res) => {
      const result = zodSchemaForUpdate.safeParse(req.body);

      if (!result.success) {
        console.error("Validation failed:", result.error.errors);
        return res.status(401).json({
          message: "Validation failed",
          errors: result.error.errors,
        });
      }

      try {
        const updateData = result.data;
        const userName = req.userName;

        const updatedUser = await User.findOneAndUpdate(
          { userName: userName },
          updateData,
          { new: true } // Return the updated document
        );

        res.status(200).json(updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    });

    router.get("/signup", function (req, res) {
      res.send("This is the Signup page");
    });
    router.get("/signin", function (req, res) {
      res.send("this is the signin page ");
    });

    module.exports = router;

    /////////////////////////////////////////////////////// Find User ///////////////////////////////////////
    router.get("/find", async (req, res) => {
      const filter = req.query.filter || "";

      const users = await User.find({
        $or: [
          {
            firstName: {
              $regex: filter,
              $options: "i",
            },
          },
          {
            lastName: {
              $regex: filter,
              $options: "i",
            },
          },
        ],
      });

      res.json({
        user: users.map((user) => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id,
        })),
      });
    });

    const updateData = result.data;
    const userName = req.userName;

    const updatedUser = await User.findOneAndUpdate(
      { userName: userName },
      updateData,
      { new: true } // Return the updated document
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/signup", function (req, res) {
  res.send("This is the Signup page");
});
router.get("/signin", function (req, res) {
  res.send("this is the signin page ");
});

/////////////////////////////////////////////////////// Find User ///////////////////////////////////////
router.get("/find", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
          $options: "i",
        },
      },
      {
        lastName: {
          $regex: filter,
          $options: "i",
        },
      },
    ],
  });

  res.json({
    user: users.map((user) => ({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      _id: user._id,
    })),
  });
});

module.exports = router;
