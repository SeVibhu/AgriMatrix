// backend/server.js
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Example data
let items = [
  { id: 1, name: "First Item" },
  { id: 2, name: "Second Item" }
];

// Routes
app.get("/items", (req, res) => {
  res.json(items);
});

app.post("/items", (req, res) => {
  const newItem = { id: Date.now(), name: req.body.name };
  items.push(newItem);
  res.json(newItem);
});

app.put("/items/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index].name = req.body.name;
    res.json(items[index]);
  } else {
    res.status(404).json({ error: "Item not found" });
  }
});

// 👇 Important: listen on 0.0.0.0 so iPhone can connect
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running at http://0.0.0.0:${PORT}`);
});