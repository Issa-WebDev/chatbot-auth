import express from "express";
import path from "path";
import collection from "./config.js";
import bcrypt from "bcrypt";

const app = express();
// convert data into json format
app.use(express.json());
// Static file
app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
//use EJS as the view engine
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

// Register User
app.post("/signup", async (req, res) => {
  const data = {
    email: req.body.useremail,
    password: req.body.password,
  };

  // Check if the username already exists in the database
  const existingUser = await collection.findOne({ email: data.email });

  if (existingUser) {
    res.send("User already exists. Please choose a different username.");
  } else {
    // Hash the password using bcrypt
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; // Replace the original password with the hashed one

    await collection.insertMany(data);
    res.render("login");
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ email: req.body.useremail });
    if (!check) {
      res.send("User name cannot found");
    }
    // Compare the hashed password from the database with the plaintext password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (!isPasswordMatch) {
      res.send("wrong Password");
    } else {
      res.render("chatbot");
    }
  } catch {
    res.send("wrong Details");
  }
});

// Define Port for Application
const port = 1000;
app.listen(port, () => {
  console.log(`Server is Up  http://localhost:${port}`);
});
