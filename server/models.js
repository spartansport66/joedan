const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
});

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
});

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String },
  details: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true },
});

module.exports = {
  Category: mongoose.model('Category', CategorySchema),
  Subcategory: mongoose.model('Subcategory', SubcategorySchema),
  Product: mongoose.model('Product', ProductSchema),
};
