const express = require("express");
const pool = require("../db/pool");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, COUNT(e.id)::int AS employee_count
      FROM departments d
      LEFT JOIN employees e ON e.department_id = d.id
      GROUP BY d.id ORDER BY d.name
    `);
    res.json(result.rows);
  } catch {
    res.status(500).json({ error: "Failed to fetch departments" });
  }
});

router.post("/", auth, async (req, res) => {
  const { name, description } = req.body;
  if (!name) return res.status(400).json({ error: "Name required" });
  try {
    const result = await pool.query(
      "INSERT INTO departments (name, description) VALUES ($1, $2) RETURNING *",
      [name, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    if (e.code === "23505") return res.status(409).json({ error: "Department already exists" });
    res.status(500).json({ error: "Failed to create department" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM departments WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Department not found" });
    res.json({ message: "Department deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete department" });
  }
});

module.exports = router;
