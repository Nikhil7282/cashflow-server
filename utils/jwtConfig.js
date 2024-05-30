import jwt, { decode } from "jsonwebtoken";
import { configDotenv } from "dotenv";
configDotenv();

export const createAccessToken = async (username, id) => {
  const accessToken = await jwt.sign(
    { username: username, id: id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "10m" }
  );
  return accessToken;
};

export const createRefreshToken = async (username) => {
  const refreshToken = await jwt.sign(
    { username: username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
  return refreshToken;
};

export const verifyJwt = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ message: "Unauthorized" });
  const token = authHeader.split(" ")[1];
  if (token == null) return res.status(401).json({ message: "Unauthorized" });
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(401).json({ message: "Invalid Token" });
    req.user = user;
    next();
  });
};

export const verifyRefreshToken = async (refreshToken, foundUser) => {
  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    if (foundUser.username !== decoded.username) {
      return {
        verified: false,
        message: "Invalid RefreshToken",
        decoded: null,
      };
    } else {
      return { verified: true, message: "Valid RefreshToken", decoded };
    }
  } catch (error) {
    console.error("Error verifying RefreshToken:", error);
    return { verified: false, message: "Invalid RefreshToken", decoded: null };
  }
};
