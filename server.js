require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Item = require('./models/Item');

const app = express();
app.use(cors());
app.use(express.json());

// ⭐ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB Connected"))
.catch(err => console.error("MongoDB connection error:", err));

// ⭐ GET all items
app.get('/items', async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// ⭐ POST new item
app.post('/items', async (req, res) => {
  try {
    const newItem = new Item({ name: req.body.name });
    await newItem.save();
    res.json({ message: "Item added!", newItem });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add item' });
  }
});

// ⭐ Optional: PUT / DELETE routes
app.put('/items/:id', async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );
    res.json({ message: "Item updated!", updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

app.delete('/items/:id', async (req, res) => {
  try {
    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted!" });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ⭐ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
