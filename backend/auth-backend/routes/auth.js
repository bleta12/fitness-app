import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../src/config.js";

const router = express.Router();

router.get("/users", (req, res) => {
    db.query("SELECT id, username, email, created_at FROM users", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});



router.post("/signup", async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        db.query(
            "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
            [username, email, hashedPassword],
            (err, result) => {
                if (err) return res.status(500).json({ error: err.message });

                // Generate token with unique payload (insertId + timestamp)
                const token = jwt.sign(
                    {
                        id: result.insertId,
                        username,
                        email,
                        ts: Date.now(), // add timestamp for uniqueness
                    },
                    "your_jwt_secret",
                    { expiresIn: "1h" }
                );

                res.status(201).json({
                    message: "User registered successfully!",
                    token,
                    username,
                    email,
                });
            }
        );
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


router.post("/login", (req, res) => {
    const { email, password } = req.body;

    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(400).json({ message: "User not found" });

        const user = results[0];

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            "your_jwt_secret",
            { expiresIn: "1h" }
        );
        res.json({ message: "Login successful", token, username: user.username,email: user.email });
    });
});


export default router;
