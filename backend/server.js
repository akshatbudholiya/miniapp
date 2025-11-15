import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

dotenv.config();
console.log("Supabase URL: ", process.env.SUPABASE_URL ? "Set" : "Not Set");
const app = express();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

console.log(`Allowed CORS Origin: ${CLIENT_URL}`); 

app.use(cors({ 
    origin: CLIENT_URL, 
    methods: ["GET", "POST"]}));
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);
if (supabase) {
    console.log("Supabase client initialized.");
}
const JWT_SECRET = process.env.JWT_SECRET;

app.post("/login", async (req, res) => {
  console.log("--- START LOGIN REQUEST ---");
  console.log("Request Body Received:", req.body);

  let { email, password } = req.body;

  if (!email || !password) {
    console.error("Login failed: Missing email or password in request body.");
    return res.status(400).json({ message: "Email and password are required" });
  }

  email = email.trim().toLowerCase();
  password = password.trim();

  console.log("Login attempt for email:", email);

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    console.log("Supabase Query Result - Error:", error);
    console.log("Supabase Query Result - User Data:", user ? "Found" : "Not Found");

    if (error || !user) {
      console.log("Login failed: User not found or DB error occurred.");
      return res.status(401).json({ message: "Invalid credentials" });
    }
    
    if (user.password !== password) {
      console.log("Login failed: Password mismatch.");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!JWT_SECRET) {
      console.error("JWT_SECRET is not set in environment variables. Cannot sign token.");
      return res.status(500).json({ message: "Server configuration error" }); 
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
    console.log("Login successful for:", email);
    res.json({ token });
  } catch (err) {
    console.error("Login error during processing:", err);
    res.status(500).json({ message: "Server error" });
  } finally {
    console.log("--- END LOGIN REQUEST ---");
  }
});

// Pricelist route
app.get("/pricelist", async (req, res) => {
  try {
    console.log("Attempting to fetch pricelist data...");
    const { data, error } = await supabase.from("pricelist").select("*");
    
    if (error) { 
      console.error("Database fetch error on pricelist:", error.message);
      return res.status(500).json({ message: "Database fetch error: " + error.message });
    }
    
    console.log(`Pricelist fetched successfully. Items count: ${data ? data.length : 0}`);
    
    res.json(data);
  } catch (err) {
    console.error("Error fetching pricelist:", err.message);
    res.status(500).json({ message: "Server error: " + err.message });
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