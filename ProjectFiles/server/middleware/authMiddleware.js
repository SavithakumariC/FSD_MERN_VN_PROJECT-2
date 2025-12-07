import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    console.log("Received token:", token); // Add this line

    if (!token)
      return res.status(401).json({ msg: "No token, authorization denied" });

    const decoded = jwt.verify(token, "1234"); // Must match frontend
    console.log("Decoded token:", decoded); // Add this line

    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token verification error:", err.message);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};
