import mysql from "mysql2";

const db = mysql.createConnection({
    host: "localhost",
    user: "root",       // your MySQL username
    password: "Teosi13579tek",       // your MySQL password
    database: "auth_demo" // your database name
});

// connect to DB
db.connect((err) => {
    if (err) {
        console.error("❌ Database connection failed: " + err.stack);
        return;
    }
    console.log("✅ Connected to MySQL database.");
});

export default db;  // <-- make sure you have this line
