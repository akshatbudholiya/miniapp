import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(express.json());

const supabase = createClient(
  "https://dzigxtdsyruphaoktflc.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR6aWd4dGRzeXJ1cGhhb2t0ZmxjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mjc5MjI3MywiZXhwIjoyMDc4MzY4MjczfQ.B0Cs6o7zu7iBb5bpbRVGeXTFdaxJaBq3ThKL4emR1cI"
);

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  email = email.trim().toLowerCase();
  password = password.trim();

  console.log("Login attempt:", email, password);

  try {
    // Fetch user from Supabase
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    console.log("User fetched:", user, "Error:", error);

    if (error || !user) {
      console.log("Login failed: user not found");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare password
    if (user.password !== password) {
      console.log("Login failed: wrong password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful, token generated");
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(4000, () => console.log("Server running on port 4000"));
