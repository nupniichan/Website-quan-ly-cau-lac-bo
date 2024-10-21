const mongoose = require('mongoose');
const Counter = require('./Counter');

const budgetAllocationSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    club: { type: Number, ref: 'Club', required: true },
    amount: { type: Number, required: true },
    purpose: { type: String, required: true },
    allocationDate: { type: Date, required: true },
});

budgetAllocationSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'budgetAllocationId' },
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

const BudgetAllocation = mongoose.model('BudgetAllocation', budgetAllocationSchema);
module.exports = BudgetAllocation;
