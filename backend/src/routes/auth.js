const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");

const router = express.Router();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  try {
    const result = await pool.query("SELECT * FROM admin_users WHERE username = $1", [username]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid credentials" });
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token, username: user.username });
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/register-admin", async (req, res) => {
  const { username, password, setupKey } = req.body;
  if (setupKey !== process.env.JWT_SECRET) {
    return res.status(403).json({ error: "Forbidden" });
  }
  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }
  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)",
      [username, hash]
    );
    res.status(201).json({ message: "Admin created" });
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "Username taken" });
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
