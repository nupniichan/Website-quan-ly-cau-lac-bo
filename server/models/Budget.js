const mongoose = require('mongoose');

// Schema cho thông tin ngân sách (Budget)
const budgetSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    khoanChiTieu: { type: Number, required: true },
    nguonThu: { type: Number, required: true },
    ngay: { type: Date, required: true },
    thanhVienChiuTrachNhiem: { type: String, required: true },
    noiDung: { type: String, required: true }
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
