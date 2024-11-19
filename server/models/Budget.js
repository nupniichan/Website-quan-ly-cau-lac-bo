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

            // Cập nhật budget của club khi thêm mới
            await mongoose.model('Club').findByIdAndUpdate(
                this.club,
                { $inc: { budget: this.nguonThu - this.khoanChiTieu } }
            );
        } catch (error) {
            return next(error);
        }
    }

    // Cập nhật budget của club khi sửa
    if (!this.isNew && (this.isModified('nguonThu') || this.isModified('khoanChiTieu'))) {
        try {
            const original = await this.constructor.findById(this._id);
            const oldDifference = original.nguonThu - original.khoanChiTieu;
            const newDifference = this.nguonThu - this.khoanChiTieu;
            const budgetChange = newDifference - oldDifference;
            
            await mongoose.model('Club').findByIdAndUpdate(
                this.club,
                { $inc: { budget: budgetChange } }
            );
        } catch (error) {
            return next(error);
        }
    }
    next();
});

// Thêm middleware cho xóa
budgetSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
    try {
        await mongoose.model('Club').findByIdAndUpdate(
            this.club,
            { $inc: { budget: -(this.nguonThu - this.khoanChiTieu) } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

const Budget = mongoose.model('Budget', budgetSchema);
module.exports = Budget;
