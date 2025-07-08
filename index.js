import express from "express";
import cors from "cors";
import connectDB from "./Database/db.js";
import authRouter from "./routes/auth.js";
import DepartmentRouter from "./routes/department.js";
import EmployeeRouter from "./routes/employee.js";
import SalaryRouter from "./routes/salary.js";
import leaveRoutes from "./routes/leave.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "https://payroll-ms-backend.vercel.app/",
    credentials: true,
  })
);
app.use("/uploads", express.static("public/uploads"));
app.use("/api/auth", authRouter);
app.use("/api/department", DepartmentRouter);
app.use("/api/employee", EmployeeRouter);
app.use("/api/salary", SalaryRouter);
app.use("/api/leave", leaveRoutes);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(process.env.PORT, () => {
  connectDB()
    .then(() => {
      console.log("Database connected successfully");
    })
    .catch((err) => {
      console.error("Database connection failed:", err);
    });
  console.log(`Server is running on port ${process.env.PORT}`);
});
