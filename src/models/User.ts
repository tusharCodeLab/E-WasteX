import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['seller', 'buyer', 'admin'], default: 'seller' },
  bio: { type: String, default: '' },
  company: { type: String, default: '' },
  location: { type: String, default: '' },
  phone: { type: String, default: '' },
  website: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
