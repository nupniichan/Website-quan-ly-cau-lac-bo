const mongoose = require('mongoose');
const Counter = require('./Counter'); // Import Counter để tự động tăng ID

// Schema cho thông tin ngân sách (Budget)
const budgetSchema = new mongoose.Schema({
    _id: { type: Number },  // ID là số nguyên, tự động tăng
    ten: { type: String, required: true },
    khoanChiTieu: { type: Number, required: true },
    nguonThu: { type: Number },
    ngay: { type: Date, required: true },
    thanhVienChiuTrachNhiem: { type: String, required: true },
    noiDung: { type: String, required: true },
    club: { type: Number, ref: 'Club', required: true }  // Liên kết với clubId là số nguyên
});

// Hook trước khi lưu để tự động tăng giá trị _id bằng Counter
budgetSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'budgetId' },
                { $inc: { seq: 1 } },  // Tăng giá trị seq cho mỗi ngân sách mới
                { new: true, upsert: true }  // Tạo mới nếu không có
            );
            if (!counter) {
                return next(new Error('Counter not found for budgetId'));
            }
            this._id = counter.seq;  // Gán giá trị seq cho _id của Budget
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
