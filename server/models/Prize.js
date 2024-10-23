const mongoose = require('mongoose');
const Counter = require('./Counter');

// Schema cho thông tin giải thưởng (Prize)
const prizeSchema = new mongoose.Schema({
    _id: { type: Number },  // ID là số nguyên, tự động tăng
    tenGiaiThuong: { type: String, required: true },
    ngayDatGiai: { type: Date, required: true },
    loaiGiai: { type: String, required: true },
    thanhVienDatGiai: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },
    club: { type: mongoose.Schema.Types.ObjectId, ref: 'Club', required: true },
    ghiChu: { type: String },
    anhDatGiai: { type: String }
});

// Hook tự động tăng _id cho Prize bằng Counter
prizeSchema.pre('save', async function (next) {
    if (this.isNew) {  // Nếu tài liệu là mới
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'prizeId' },  // _id của counter
                { $inc: { seq: 1 } },  // Tăng giá trị seq
                { new: true, upsert: true }  // Tạo mới nếu chưa có
            );
            this._id = counter.seq;  // Gán giá trị seq từ Counter cho _id
            next();  // Tiếp tục lưu tài liệu
        } catch (error) {
            next(error);  // Trả lỗi nếu có vấn đề
        }
    } else {
        next();  // Nếu không phải tài liệu mới, tiếp tục lưu
    }
});

const Prize = mongoose.model('Prize', prizeSchema);
module.exports = Prize;
