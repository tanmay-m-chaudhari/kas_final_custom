const express = require("express");
const { body, query, validationResult } = require("express-validator");
const pool = require("../db/pool");
const auth = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res) => {
  const { search, department_id, status, page = 1, limit = 20 } = req.query;
  const offset = (parseInt(page) - 1) * parseInt(limit);
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(`(e.first_name ILIKE $${params.length} OR e.last_name ILIKE $${params.length} OR e.email ILIKE $${params.length} OR e.job_title ILIKE $${params.length})`);
  }
  if (department_id) {
    params.push(department_id);
    conditions.push(`e.department_id = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`e.status = $${params.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  try {
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM employees e ${where}`,
      params
    );
    const total = parseInt(countResult.rows[0].count);

    params.push(parseInt(limit), offset);
    const result = await pool.query(
      `SELECT e.*, d.name AS department_name
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       ${where}
       ORDER BY e.last_name, e.first_name
       LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );
    res.json({ data: result.rows, total, page: parseInt(page), limit: parseInt(limit) });
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch employees" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT e.*, d.name AS department_name
       FROM employees e
       LEFT JOIN departments d ON e.department_id = d.id
       WHERE e.id = $1`,
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Employee not found" });
    res.json(result.rows[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch employee" });
  }
});

router.post("/", auth,
  body("first_name").trim().notEmpty(),
  body("last_name").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { first_name, last_name, email, phone, job_title, department_id, hire_date, status, avatar_url } = req.body;
    try {
      const result = await pool.query(
        `INSERT INTO employees (first_name, last_name, email, phone, job_title, department_id, hire_date, status, avatar_url)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
        [first_name, last_name, email, phone || null, job_title || null, department_id || null, hire_date || null, status || "active", avatar_url || null]
      );
      res.status(201).json(result.rows[0]);
    } catch (e) {
      if (e.code === "23505") return res.status(409).json({ error: "Email already exists" });
      res.status(500).json({ error: "Failed to create employee" });
    }
  }
);

router.put("/:id", auth,
  body("email").optional().isEmail().normalizeEmail(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { first_name, last_name, email, phone, job_title, department_id, hire_date, status, avatar_url } = req.body;
    try {
      const result = await pool.query(
        `UPDATE employees SET
          first_name = COALESCE($1, first_name),
          last_name  = COALESCE($2, last_name),
          email      = COALESCE($3, email),
          phone      = COALESCE($4, phone),
          job_title  = COALESCE($5, job_title),
          department_id = COALESCE($6, department_id),
          hire_date  = COALESCE($7, hire_date),
          status     = COALESCE($8, status),
          avatar_url = COALESCE($9, avatar_url),
          updated_at = NOW()
         WHERE id = $10 RETURNING *`,
        [first_name, last_name, email, phone, job_title, department_id, hire_date, status, avatar_url, req.params.id]
      );
      if (result.rows.length === 0) return res.status(404).json({ error: "Employee not found" });
      res.json(result.rows[0]);
    } catch (e) {
      if (e.code === "23505") return res.status(409).json({ error: "Email already exists" });
      res.status(500).json({ error: "Failed to update employee" });
    }
  }
);

router.delete("/:id", auth, async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM employees WHERE id = $1 RETURNING id", [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Employee not found" });
    res.json({ message: "Employee deleted" });
  } catch {
    res.status(500).json({ error: "Failed to delete employee" });
  }
});

module.exports = router;
