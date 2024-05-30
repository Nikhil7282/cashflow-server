import { body } from "express-validator";

export const loginValidator = [
  body("username", "Username should not be Empty").not().isEmpty(),
  body("username", "The minimum username length is 8 characters").isLength({
    min: 8,
  }),
  body(
    "username",
    "Username should not contain special characters or spaces"
  ).matches(/^[a-zA-Z0-9]+$/),
  body("password", "Password Should not be Empty").not().isEmpty(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
  body(
    "password",
    "The password should not contain special characters or spaces"
  ).matches(/^[a-zA-Z0-9]+$/),
];

export const signUpValidator = [
  body("username", "Username should not be Empty").not().isEmpty(),
  body("username", "The minimum username length is 8 characters").isLength({
    min: 8,
  }),
  body(
    "username",
    "Username should not contain special characters or spaces"
  ).matches(/^[a-zA-Z0-9]+$/),
  body("password", "Password Should not be Empty").not().isEmpty(),
  body("password", "The minimum password length is 6 characters").isLength({
    min: 6,
  }),
  body(
    "password",
    "The password should not contain special characters or spaces"
  ).matches(/^[a-zA-Z0-9]+$/),
  body("phoneNumber", "Phone Number Should not be empty").not().isEmpty(),
  body("phoneNumber", "Phone Number should be of 10 digits").isLength({
    min: 10,
    max: 10,
  }),
  body("phoneNumber", "Enter valid phone number").matches(/^[0-9]{10}$/),
  body("email", "Email Should not be empty").not().isEmpty(),
  body("email", "Enter valid email").isEmail(),
];

export const updateUserValidator = [
  body("username", "Username should not be Empty").not().isEmpty(),
  body("username", "The minimum username length is 8 characters").isLength({
    min: 8,
  }),
  body("phoneNumber", "Phone Number Should not be empty").not().isEmpty(),
  body("phoneNumber", "Phone Number should be of 10 digits").isLength({
    min: 10,
    max: 10,
  }),
  body("phoneNumber", "Enter valid phone number").matches(/^[0-9]{10}$/),
  body("email", "Email Should not be empty").not().isEmpty(),
  body("email", "Enter valid email").isEmail(),
];

export const budgetValidator = [
  body("categoryName", "Budget Should not be Empty").not().isEmpty(),
  body("total", "Total Should not be empty").not().isEmpty(),
];

export const spentDetailsValidator = [
  body("amount", "Amount should not be empty").not().isEmpty(),
  body("spentOn", "Spent On should not be empty").not().isEmpty(),
];
