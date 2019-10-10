const express = require("express");
const mongoose = require("mongoose");

const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const map = require("./routes/api/map");

const app = express();

const db = require("./config/keys").mongoURI;
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

// Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/map", map);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));
