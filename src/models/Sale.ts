import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  date: { type: Date, required: true },
  total: { type: String, required: true }, // Keeping as string due to currency format
  status: {
    type: String,
    enum: ['pendiente', 'confirmada'],
    default: 'pendiente'
  },
  cashier: { type: String, required: true }, // "Cajero" in Spanish
  paymentMethod: { type: String, required: true }, // "Metodo de Pago" in Spanish
  transactionNumber: { type: String, default: 'N/A' }, // "Nro. Transacción" in Spanish
  details: { type: String, required: true }
}, {
  timestamps: true,
  versionKey: false
});

const Sale = mongoose.models.Sale || mongoose.model('Sale', saleSchema);

export default Sale;