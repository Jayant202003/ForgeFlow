const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    console.log("✅ MongoDB Native Client Connected");
  }
}

async function signup(req, res) {
  const { username, password, email } = req.body;

  try {
    await connectClient();

    const db = client.db("forgeflow");
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists!",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      username,
      email,
      password: hashedPassword,
      repositories: [],
      followedUsers: [],
      starRepos: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    const token = jwt.sign(
      {
        id: result.insertedId.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(201).json({
      token,
      userId: result.insertedId,
      message: "Signup Successful!",
    });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
}

async function login(req, res) {
  const { email, password } = req.body;

  try {
    await connectClient();

    const db = client.db("forgeflow");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({
      token,
      userId: user._id,
      message: "Login Successful!",
    });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
}

async function getAllUsers(req, res) {
  try {
    await connectClient();

    const db = client.db("forgeflow");
    const usersCollection = db.collection("users");

    const users = await usersCollection.find({}).toArray();

    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
}

async function getUserProfile(req, res) {
  try {
    await connectClient();

    const db = client.db("forgeflow");
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne({
      _id: new ObjectId(req.params.id),
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
}

async function updateUserProfile(req, res) {
  try {
    await connectClient();

    const db = client.db("forgeflow");
    const usersCollection = db.collection("users");

    const updateData = {
      email: req.body.email,
      updatedAt: new Date(),
    };

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const result = await usersCollection.findOneAndUpdate(
      {
        _id: new ObjectId(req.params.id),
      },
      {
        $set: updateData,
      },
      {
        returnDocument: "after",
      }
    );

    if (!result) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
}

async function deleteUserProfile(req, res) {
  try {
    await connectClient();

    const db = client.db("forgeflow");
    const usersCollection = db.collection("users");

    const result = await usersCollection.deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({
      message: "Server Error",
    });
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};