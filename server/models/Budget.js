const mongoose = require('mongoose');
const Counter = require('./Counter');

// Schema cho thông tin ngân sách (Budget)
const budgetSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    ten: { type: String, required: true },
    khoanChiTieu: { type: Number, required: true },
    nguonThu: { type: Number, required: true },
    ngay: { type: Date, required: true },
    thanhVienChiuTrachNhiem: { type: String, required: true },
    noiDung: { type: String, required: true },
    club: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Club',
        required: true
    }
});

// Thêm middleware pre-save để tự động tăng ID
budgetSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'budgetId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this._id = counter.seq;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
