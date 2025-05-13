// Run with: node updateProductSchema.js

import mongoose from 'mongoose';

const uri = 'mongodb+srv://Psquare:mongoDBatlas@mernapp.xh4pt.mongodb.net/?retryWrites=true&w=majority&appName=MERNapp'; // Replace with your connection string

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  barcode: String,
  image_url: String,
  description: String,
});

const Product = mongoose.model('Product', productSchema);

const updateProducts = async () => {
  await mongoose.connect(uri);

  // Add missing fields with default values if not present
  await Product.updateMany(
    { image_url: { $exists: false } },
    { $set: { image_url: '' } }
  );
  await Product.updateMany(
    { description: { $exists: false } },
    { $set: { description: '' } }
  );

  // Remove fields not in the new schema
  await Product.updateMany({}, { $unset: { discount: "", createdAt: "", updatedAt: "", __v: "" } });

  console.log('Products updated!');
  await mongoose.disconnect();
};

updateProducts().catch(console.error);