require("dotenv").config();
const express = require("express");
const session = require("express-session");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const adminRoutes = require("./routes/admin.routes");
const patientRoutes = require("./routes/patient.routes");
const doctorRoutes = require("./routes/doctor.routes");
const recordRoutes = require("./routes/medical.routes");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

function requireAdmin(req, res, next) {
  if (!req.session.admin) {
    return res.redirect("/");
  }
  next();
}

app.use("/", authRoutes);
app.use("/admin", requireAdmin, adminRoutes);
app.use("/admin/patients", requireAdmin, patientRoutes);
app.use("/admin/doctors", requireAdmin, doctorRoutes);
app.use("/admin/medical", requireAdmin, recordRoutes);

app.listen(process.env.PORT, () => {
  console.log(`🚀 http://localhost:${process.env.PORT}`);
});
