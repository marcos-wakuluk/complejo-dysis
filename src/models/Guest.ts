import mongoose from 'mongoose';

const guestSchema = new mongoose.Schema({
  number: { type: Number, required: true },
  name: { type: String, required: true },
  dni: { type: Number, required: true, unique: true },
  age: { type: Number, required: true },
  phone: { type: String, required: true },
  instagram: { type: String },
  photo: { type: String },
  date: { type: Date, required: true },
  guestCode: { type: String },
  status: {
    type: String,
    enum: ['Pendiente', 'Aceptado'],
    default: 'Pendiente'
  }
}, {
  timestamps: true,
  versionKey: false
});

const Guest = mongoose.models.Guest || mongoose.model('Guest', guestSchema);

export default Guest;