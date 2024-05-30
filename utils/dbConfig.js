// import Sequelize from "sequelize";
import mysql from "mysql2";
import { configDotenv } from "dotenv";
configDotenv();

let pool;
function createPool() {
  try {
    pool = mysql
      .createPool({
        host: "localhost",
        user: process.env.DBUser,
        password: process.env.DBPassword,
        database: process.env.DBName,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
      })
      .promise();
    console.log("Database Connected");
    return pool;
  } catch (error) {
    console.log(error);
  }
}

export const executeQuery = (query, params) => {
  return new Promise((resolve, reject) => {
    pool.query(query, params, (error, result) => {
      if (error) {
        reject(error);
      } else {
        console.log(result);
        resolve(result);
      }
    });
  });
};

export default createPool();

// export function dbConnect() {
//   const sequelize = new Sequelize("cashflow", "root", "root123", {
//     host: "localhost",
//     dialect: "mysql",
//   });
//   sequelize
//     .authenticate()
//     .then(() => {
//       console.log("Connection has been established successfully.");
//     })
//     .catch((error) => {
//       console.error("Unable to connect to the database: ", error);
//     });
// }
