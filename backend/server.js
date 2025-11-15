import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";
app.use(cors({ 
    origin: CLIENT_URL, 
    methods: ["GET", "POST"]}));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

const JWT_SECRET = process.env.JWT_SECRET;

// Login route
app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();
  password = password.trim();

  console.log("Login attempt:", email);

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) return res.status(401).json({ message: "Invalid credentials" });
    if (user.password !== password) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    console.log("Login successful for:", email);
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Pricelist route
app.get("/pricelist", async (req, res) => {
  try {
    const { data, error } = await supabase.from("pricelist").select("*");
    if (error) return res.status(500).json({ message: "Database fetch error" });
    res.json(data);
  } catch (err) {
    console.error("Error fetching pricelist:", err.message);
    res.status(500).json({ message: "Server error" });
  }
});

// Terms Route
app.get("/terms/:lang", async (req, res) => {
  const { lang } = req.params;

  try {
    const { data, error } = await supabase
      .from("terms")
      .select("language, title, content")
      .eq("language", lang)
      .single();

    if (error || !data) {
      return res.status(404).json({ message: "Terms not found" });
    }

    res.json(data);
  } catch (err) {
    console.error("Terms fetch error:", err);
    res.status(500).json({ message: "Server error fetching terms" });
  }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});