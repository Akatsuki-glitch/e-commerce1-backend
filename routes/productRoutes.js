const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/Product");

// Middleware to check MongoDB connection
const checkConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ 
      error: "Database connection not available",
      message: "MongoDB is not connected. Please check your database connection string and try again.",
      readyState: mongoose.connection.readyState
    });
  }
  next();
};

// Get all products
router.get("/", checkConnection, async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).maxTimeMS(30000);
    res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        error: "Database connection error",
        message: "Unable to connect to MongoDB. Please check your database connection."
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// Get single product
router.get("/:id", checkConnection, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).maxTimeMS(30000);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    if (err.name === 'MongoServerSelectionError' || err.name === 'MongoNetworkError') {
      return res.status(503).json({ 
        error: "Database connection error",
        message: "Unable to connect to MongoDB. Please check your database connection."
      });
    }
    res.status(500).json({ error: err.message });
  }
});

// Create product
router.post("/", async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update product
router.put("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete product
router.delete("/:id", async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

