const mongoose = require('mongoose');
const Counter = require('./Counter');

const budgetAllocationSchema = new mongoose.Schema({
    _id: { type: Number },  // Bỏ required: true
    club: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true 
    },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    allocationDate: { type: Date, required: true } 
});

// Sửa lại middleware pre-save
budgetAllocationSchema.pre('save', async function(next) {
    try {
        if (!this._id) {  // Chỉ tạo _id mới nếu chưa có
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'budgetAllocationId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this._id = counter.seq;
        }

        // Cập nhật budget của club khi thêm phân bổ mới
        if (this.isNew) {
            await mongoose.model('Club').findByIdAndUpdate(
                this.club,
                { $inc: { budget: this.amount } }
            );
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Thêm middleware pre-remove để cập nhật budget khi xóa phân bổ
budgetAllocationSchema.pre('remove', async function(next) {
    try {
        await mongoose.model('Club').findByIdAndUpdate(
            this.club,
            { $inc: { budget: -this.amount } }
        );
        next();
    } catch (error) {
        next(error);
    }
});

const BudgetAllocation = mongoose.model('BudgetAllocation', budgetAllocationSchema);
module.exports = BudgetAllocation;
