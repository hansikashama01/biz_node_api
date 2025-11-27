require("dotenv").config();  // ← Load .env

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Item = require('./models/Item');

const app = express();
app.use(cors());
app.use(express.json());

// ⭐ Connect to MongoDB Atlas from .env
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ⭐ GET
app.get('/api/items', async (req, res) => {
  const items = await Item.find();
  res.json(items);
});

// ⭐ POST
app.post('/api/items', async (req, res) => {
  const newItem = new Item({ name: req.body.name });
  await newItem.save();
  res.json({ message: "Item added!", newItem });
});

// ⭐ PUT
app.put('/api/items/:id', async (req, res) => {
  const updated = await Item.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  res.json({ message: "Item updated!", updated });
});

// ⭐ DELETE
app.delete('/api/items/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: "Item deleted!" });
});

// ⭐ FIXED: Start server using PORT from .env
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
