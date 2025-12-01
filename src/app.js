require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");
const commentRoutes = require("./routes/comments.routes");
const adminRoutes = require("./routes/admin.routes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/deals", require("./routes/deals.routes"));
app.use("/api/admin", require("./routes/admin.routes")); 
app.use("/api", commentRoutes);
app.use("/api/admin", adminRoutes); 

app.get("/", (req, res) => {
  res.send("DealExpress API is running");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
