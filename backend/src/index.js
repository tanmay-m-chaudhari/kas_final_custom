require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const employeeRoutes = require("./routes/employees");
const departmentRoutes = require("./routes/departments");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: "http://localhost:4200", credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/departments", departmentRoutes);

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => {});
