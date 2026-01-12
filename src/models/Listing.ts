import mongoose from 'mongoose';

const ListingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    required: true,
    enum: ['Laptops', 'Smartphones', 'Monitors', 'Accessories', 'Appliances', 'Industrial', 'Batteries'] 
  },
  condition: { type: String, required: true },
  hazardLevel: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'sold'], default: 'pending' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  images: [{ type: String }],
  location: { type: String, required: true },
  preciseLocation: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String },
    city: { type: String },
    area: { type: String }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Listing || mongoose.model('Listing', ListingSchema);
