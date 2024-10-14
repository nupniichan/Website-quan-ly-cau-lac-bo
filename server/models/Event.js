const mongoose = require('mongoose');
const Counter = require('./Counter');

// Schema cho thông tin sự kiện (Event)
const eventSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    ngayToChuc: { type: Date, required: true },
    thoiGianToChuc: { type: String, required: true },
    diaDiem: { type: String, required: true },
    noiDung: { type: String, required: true },
    nganSachChiTieu: { type: Number, required: true },
    nguoiPhuTrach: { type: String, required: true },
    khachMoi: { type: String },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true } // Liên kết với Club
});

eventSchema.pre('save', async function (next) {
    if (this.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'eventId' },
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

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
