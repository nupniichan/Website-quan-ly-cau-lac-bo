const mongoose = require('mongoose');
const Counter = require('./Counter');

const budgetAllocationSchema = new mongoose.Schema({
    _id: { type: Number },
    club: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Club',
        required: true 
    },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    allocationDate: { type: Date, required: true }
});

// Middleware pre-save
budgetAllocationSchema.pre('save', async function(next) {
    try {
        if (!this._id) {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'budgetAllocationId' },
                { $inc: { seq: 1 } },
                { new: true, upsert: true }
            );
            this._id = counter.seq;
        }
        next();
    } catch (error) {
        next(error);
    }
});

// Thay đổi từ pre-remove sang pre-deleteOne
budgetAllocationSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
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

// Thêm middleware cho findOneAndDelete
budgetAllocationSchema.pre('findOneAndDelete', async function(next) {
    try {
        const doc = await this.model.findOne(this.getQuery());
        if (doc) {
            await mongoose.model('Club').findByIdAndUpdate(
                doc.club,
                { $inc: { budget: -doc.amount } }
            );
        }
        next();
    } catch (error) {
        next(error);
    }
});

const BudgetAllocation = mongoose.model('BudgetAllocation', budgetAllocationSchema);
module.exports = BudgetAllocation;
