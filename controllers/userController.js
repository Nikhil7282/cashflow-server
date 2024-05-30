import { validationResult } from "express-validator";
import pool from "../utils/dbConfig.js";
import { comparePassword, hashFunction } from "../utils/bcrypt.js";
import {
  createAccessToken,
  createRefreshToken,
  verifyRefreshToken,
} from "../utils/jwtConfig.js";

export const users = async (req, res) => {
  const [result] = await pool.query(`SELECT * FROM users`);
  // console.log(result);
  res.json({ user: result });
};

export const getUser = async (req, res) => {
  try {
    const [[result]] = await pool.query(
      `SELECT id,username,email,phoneNumber FROM users where id =?`,
      [req.user.id]
    );
    // console.log(result);
    return res.status(200).json({ user: result });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errorMessage = validationErrors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }
    const [[foundUser]] = await pool.query(
      `SELECT id,username,password,email,phoneNumber FROM users WHERE username=?`,
      [req.body.username]
    );
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }
    const isPasswordMatch = await comparePassword(
      req.body.password,
      foundUser.password
    );

    if (isPasswordMatch) {
      const accessToken = await createAccessToken(
        foundUser.username,
        foundUser.id
      );
      const refreshToken = await createRefreshToken(foundUser.username);
      await pool.query("update users set refreshToken= ? where id=?", [
        refreshToken,
        foundUser.id,
      ]);
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 24 * 60 * 60 * 1000,
      });
      return res
        .status(200)
        .json({ message: "User logged in successfully", accessToken });
    } else {
      return res.status(400).json({ message: "Invalid password" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const signUpUser = async (req, res) => {
  try {
    const { username, password, email, phoneNumber } = req.body;
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errorMessage = validationErrors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }

    const [[existingUser]] = await pool.query(
      `SELECT username, password FROM users WHERE username=?`,
      [username]
    );

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const hashedPassword = await hashFunction(password);
    // console.log(hashedPassword);

    await pool.query(
      `INSERT INTO users (username, password, email, phoneNumber) VALUES (?, ?, ?, ?)`,
      [username, hashedPassword, email, phoneNumber]
    );

    return res.status(200).json({ message: "User signed up successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const cookie = req.cookies;
    // console.log(cookie);
    if (!cookie?.refreshToken)
      return res.status(403).json({ message: "Cookie Missing" });
    const refreshToken = cookie.refreshToken;
    const [[foundUser]] = await pool.query(
      `SELECT * FROM users WHERE refreshToken=?`,
      [refreshToken]
    );
    if (!foundUser) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }
    const { verified, decoded, message } = await verifyRefreshToken(
      refreshToken,
      foundUser
    );
    if (verified) {
      const accessToken = await createAccessToken(decoded.username, decoded.id);
      return res.status(200).json({ message: "AccessToken", accessToken });
    } else {
      return res.status(403).json({ message: message });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const logout = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) return res.sendStatus(204);
    const refreshToken = cookie.refreshToken;
    const [[foundUser]] = await pool.query(
      `SELECT * FROM users WHERE refreshToken=?`,
      [refreshToken]
    );
    if (!foundUser) {
      return res.sendStatus(204);
    }
    await pool.query("update users set refreshToken= ? where id=?", [
      null,
      foundUser.id,
    ]);
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 0,
    });
    return res.status(200).json({ message: "Logged Out" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { username, email, phoneNumber } = req.body;
    const validationErrors = validationResult(req);

    if (!validationErrors.isEmpty()) {
      const errorMessage = validationErrors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }
    const [[foundUser]] = await pool.query(
      `select * from users where id=${req.user.id}`
    );
    if (!foundUser) {
      return res.status(400).json({ message: "User not found" });
    }
    await pool.query(
      `update users set username=?,email=?,phoneNumber=? where id=?`,
      [username, email, phoneNumber, req.user.id]
    );
    return res.status(200).json({ message: "User updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};
