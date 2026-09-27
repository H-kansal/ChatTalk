import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key_12345";

export const VerifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided, authorization denied." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decodeValue = jwt.verify(token, JWT_SECRET);
    if (decodeValue) {
      req.user = decodeValue;
      return next();
    }
  } catch (e) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

export const VerifySocketToken = async (socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("Authentication token required."));
  }

  try {
    const decodeValue = jwt.verify(token, JWT_SECRET);

    if (decodeValue) {
      socket.user = decodeValue;
      return next();
    }
  } catch (e) {
    return next(new Error("Invalid or expired token."));
  }
};
