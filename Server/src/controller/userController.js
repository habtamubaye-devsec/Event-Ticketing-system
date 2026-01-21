const User = require("../model/userModels");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User Already Exists!" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return res.status(201).json({ message: "User Registered Successfully" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    const validPassword = await bcrypt.compare(password, user.password); 
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { _id: user._id, isAdmin: Boolean(user.isAdmin) },
      process.env.TOKEN_SECRET,
      { expiresIn: "5h" }
    );

    return res.status(200).json({ token, message: "Login Success" });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const currentUser = async (req, res) => {
  try {
    const user =  await User.findById(req.user._id).select("-password");
    return res.status(200).json({data: user, message: "User fetched successfully"});
  } catch (error) {
    return res.status(500).json({ message: error.message});
  }
}

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({createdAt: -1});
    return res.status(200).json({ data: users, message: "User Fetched Successfully"});
  } catch (error) {
    return res.status(500).json({message: error.message});
  }
}

const updateUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.body.userId, req.body);
    return res.status(200).json({ message: "User Updated Successfully"})
  } catch (error) {
    return res.status(500).json({ message: error.message});
  }
}

module.exports = { registerUser, loginUser, currentUser, getAllUsers, updateUser };
