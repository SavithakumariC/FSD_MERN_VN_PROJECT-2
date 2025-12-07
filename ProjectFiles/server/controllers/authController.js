import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Freelancer from "../models/Freelancer.js";

// Secret key for JWT (keep this in env variable for production)
const JWT_SECRET = "1234"; // replace with process.env.JWT_SECRET in prod

// REGISTER
export const register = async (req, res) => {
  try {
    const { username, email, password, usertype } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({ username, email, password: passwordHash, usertype });
    const user = await newUser.save();

    if (usertype === "freelancer") {
      const newFreelancer = new Freelancer({ userId: user._id });
      await newFreelancer.save();
    }

    // Create JWT
    const token = jwt.sign({ id: user._id, usertype: user.usertype }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      user: { _id: user._id, username: user.username, email: user.email, usertype: user.usertype },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ msg: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User does not exist" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Create JWT
    const token = jwt.sign({ id: user._id, usertype: user.usertype }, JWT_SECRET, { expiresIn: "7d" });

    res.status(200).json({
      user: { _id: user._id, username: user.username, email: user.email, usertype: user.usertype },
      token
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
