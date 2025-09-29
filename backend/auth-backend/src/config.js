import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Hoxhagerta14",  // <======   Put your password in here//
    database: "auth_demo"
});

db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed: " + err.stack);
        return;
    }
    console.log("✅ Connected to MySQL database.");
});

export default db;
