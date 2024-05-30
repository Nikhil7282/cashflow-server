import { Router } from "express";
import {
  addBudgets,
  addSpentDetails,
  deleteBudget,
  deleteSpentDetails,
  getBudgets,
  getSpentDetails,
} from "../controllers/budgetController.js";
import { verifyJwt } from "../utils/jwtConfig.js";
import {
  budgetValidator,
  spentDetailsValidator,
} from "../utils/validations.js";

let budgetRouter = Router();

budgetRouter.get("/", verifyJwt, getBudgets);
budgetRouter.get("/spentDetails/:id", verifyJwt, getSpentDetails);
budgetRouter.post("/add", verifyJwt, budgetValidator, addBudgets);
budgetRouter.post(
  "/add/spentDetails/:id",
  verifyJwt,
  spentDetailsValidator,
  addSpentDetails
);

budgetRouter.delete("/deleteBudget", verifyJwt, deleteBudget);
budgetRouter.delete("/deleteSpentDetails", verifyJwt, deleteSpentDetails);

export default budgetRouter;
