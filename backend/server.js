require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;

app.use(cors());
app.use(express.json());

// MongoDB Połączenie
mongoose.connect(uri)
  .then(() => console.log("✅ Baza danych połączona"))
  .catch(err => console.error("❌ Błąd połączenia z MongoDB:", err));

// User model
const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String,
}));


// Rejestracja
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Użytkownik już istnieje" });
    }
    const newUser = new User({ username, password });
    await newUser.save();
    res.status(201).json({ message: "Użytkownik zarejestrowany" });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera" });
  }
});

// Logowanie
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "Użytkownik nie istnieje" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Nieprawidłowe hasło" });
    }

    res.status(200).json({ message: "Zalogowano pomyślnie" });
  } catch (error) {
    res.status(500).json({ message: "Błąd serwera" });
  }
});

app.use(express.static(path.join(__dirname, "client")));


app.listen(PORT, () => {
  console.log(`🚀 Serwer działa na http://localhost:${PORT}`);
});
