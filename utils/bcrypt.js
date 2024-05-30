import bcrypt from "bcryptjs";

export const hashFunction = async (password) => {
  let hashedPassword = await bcrypt.hash(password, 10);
  return hashedPassword;
};

export const comparePassword = async (password, hashedPassword) => {
  let isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
