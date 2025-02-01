import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  dni: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'promotor', 'cajero'],
    default: 'cajero',
    required: true
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  versionKey: false,
  collection: 'users' // Specify the collection name
});

// Create index for faster queries
userSchema.index({ email: 1, dni: 1 });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;