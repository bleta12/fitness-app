import mysql from "mysql2";

const mysqlDB = mysql.createConnection({
  host: "localhost",
  user: "root",
// password: "Teosi13579tek",
  password: "12345678",
  database: "auth_demo"
});

mysqlDB.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection failed: " + err.stack);
    return;
  }
  console.log("✅ Connected to MySQL database.");
});

export default mysqlDB;
