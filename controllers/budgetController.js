import { validationResult } from "express-validator";
import pool from "../utils/dbConfig.js";

import { isRedisWorking, redisClient } from "../utils/redisConfig.js";

export const getBudgets = async (req, res) => {
  try {
    if (isRedisWorking()) {
      const budgets = await redisClient.get(`budgets/${req.user.id}`);
      if (budgets != null && budgets.length > 0) {
        return res.status(200).json({
          message: "User Budgets Fetched Successfully",
          catagories: JSON.parse(budgets),
        });
      }
    }
    const [catagories] = await pool.query(
      "select * from categories where userId=?",
      [req.user.id]
    );
    isRedisWorking() &&
      redisClient.setEx(
        `budgets/${req.user.id}`,
        3600,
        JSON.stringify(catagories)
      );
    res
      .status(200)
      .json({ message: "User Budgets Fetched Successfully", catagories });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const getSpentDetails = async (req, res) => {
  try {
    const categoryId = req.params.id;
    if (!categoryId) {
      return res.status(404).json({ message: "Category not found" });
    }
    const [spentDetails] = await pool.query(
      "select * from spentDetails where categoryId=?",
      [categoryId]
    );
    return res.status(200).json({
      message: "Budget SpentDetails Fetched Successfully",
      spentDetails,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error });
  }
};

export const addBudgets = async (req, res) => {
  try {
    // console.log(req.user);
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errorMessage = validationErrors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }
    const { categoryName, total, spent } = req.body;
    const insertResult = await pool.query(
      `insert into categories (userId,categoryName, total, spent) values (?,?, ?,?)`,
      [req.user.id, categoryName, total, spent]
    );
    return res.status(200).json({ message: "Inserted", insertResult });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteBudget = async (req, res) => {
  try {
    const categoryId = req.query.id;
    // console.log(categoryId);
    const [[budget]] = await pool.query(
      "select * from categories where id = ?",
      [categoryId]
    );
    if (!budget) {
      return res.status(404).json({ message: "Budget not found" });
    }
    await pool.query("delete from spentdetails where categoryId = ?", [
      categoryId,
    ]);
    await pool.query("delete from categories where id = ?", [categoryId]);

    res.status(200).json({ message: "Budget Removed", budget });
  } catch (error) {
    return res.status(500).json({ message: error.message, error });
  }
};

export const addSpentDetails = async (req, res) => {
  try {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      const errorMessage = validationErrors.array()[0].msg;
      return res.status(400).json({ message: errorMessage });
    }

    const categoryId = req.params.id;
    const [[category]] = await pool.query(
      "SELECT * FROM categories WHERE id = ?",
      [categoryId]
    );

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const { amount, spentOn } = req.body;

    const insertResult = await pool.query(
      `INSERT INTO spentdetails (categoryId, amount, spentOn) VALUES (?, ?, ?)`,
      [categoryId, amount, spentOn]
    );

    return res
      .status(200)
      .json({ message: "SpentDetails Added", insertResult });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

export const deleteSpentDetails = async (req, res) => {
  try {
    const requestedSpentDetailId = req.query.id;

    const [[spentDetail]] = await pool.query(
      "SELECT * FROM spentdetails WHERE id = ?",
      [requestedSpentDetailId]
    );

    if (!spentDetail) {
      return res.status(404).json({ message: "Spent Detail not found" });
    }

    await pool.query("DELETE FROM spentdetails WHERE id = ?", [
      requestedSpentDetailId,
    ]);

    return res.status(200).json({ message: "Spent Detail deleted" });
  } catch (error) {
    console.error("Error deleting spent detail:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
