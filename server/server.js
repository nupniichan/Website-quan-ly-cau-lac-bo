const express = require('express');
const mongoose = require('mongoose');

// Kết nối MongoDB
const connectDB = async () => {
    try{
        const conn = await mongoose.connect('mongodb+srv://nupniichan01:H1nixHkL97y4F7Sx@clustercnpm.wzxo0.mongodb.net/QuanLyCLB?retryWrites=true&w=majority&appName=ClusterCNPM',{
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error){
        console.error(error);
        process.exit(1);
    }
}

// Schema cho thông tin câu lạc bộ (Club)
const clubSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    logo: { type: String },
    linhVucHoatDong: { type: String, required: true },
    thanhVien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],  // Liên kết đến thành viên
    thanhVienQuanLy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }], // Liên kết đến thành viên quản lý
    ngayThanhLap: { type: Date, required: true },
    cacHoatDong: { type: String }, // Mô tả các hoạt động
    suKien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],  // Liên kết đến các sự kiện
    lichSuHoatDong: { type: String },
    giaoVienPhuTrach: { type: String, required: true }
});

// Schema cho thông tin thành viên (Member)
const memberSchema = new mongoose.Schema({
    maSoHocSinh: { type: String, required: true },
    hoTen: { type: String, required: true },
    gioiTinh: { type: String, required: true },
    lop: { type: String, required: true },
    toHopHocTap: { type: String, required: true },
    thongTinLienLac: { type: String, required: true },
    ngayThamGia: { type: Date, required: true },
    tinhTrang: { type: String, required: true }, // Ví dụ: Đang học tập
    suKienDaThamGia: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }]  // Liên kết đến các sự kiện
});

//  Schema cho thông tin sự kiện (Event)
const eventSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    ngayToChuc: { type: Date, required: true },
    thoiGianToChuc: { type: String, required: true },
    diaDiem: { type: String, required: true },
    noiDung: { type: String, required: true },
    nganSachChiTieu: { type: Number, required: true },
    nguoiPhuTrach: { type: String, required: true },
    khachMoi: { type: String }
});

//  Schema cho thông tin ngân sách (Budget)
const budgetSchema = new mongoose.Schema({
    ten: { type: String, required: true },
    khoanChiTieu: { type: Number, required: true },
    nguonThu: { type: Number, required: true },
    ngay: { type: Date, required: true },
    thanhVienChiuTrachNhiem: { type: String, required: true },
    noiDung: { type: String, required: true }
});

//  Schema cho thông tin báo cáo (Report)
const reportSchema = new mongoose.Schema({
    tenBaoCao: { type: String, required: true },
    ngayBaoCao: { type: Date, required: true },
    nhanSuPhuTrach: { type: String, required: true },
    danhSachSuKien: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],  // Liên kết đến các sự kiện
    tongNganSachChiTieu: { type: Number, required: true },
    tongThu: { type: Number, required: true },
    ketQuaDatDuoc: { type: String, required: true }
});

//  Schema cho thông tin giải thưởng (Prize)
const prizeSchema = new mongoose.Schema({
    tenGiaiThuong: { type: String, required: true },
    ngayDatGiai: { type: Date, required: true },
    loaiGiai: { type: String, required: true },
    thanhVienDatGiai: { type: mongoose.Schema.Types.ObjectId, ref: 'Member' },  // Liên kết đến thành viên đạt giải
    ghiChu: { type: String },
    anhDatGiai: { type: String }
});

// Tạo model cho từng schema
const Club = mongoose.model('Club', clubSchema);
const Member = mongoose.model('Member', memberSchema);
const Event = mongoose.model('Event', eventSchema);
const Budget = mongoose.model('Budget', budgetSchema);
const Report = mongoose.model('Report', reportSchema);
const Prize = mongoose.model('Prize', prizeSchema);

// Khởi tạo ứng dụng Express
const app = express();

// Middleware để parse JSON
app.use(express.json());

// === API cho thông tin câu lạc bộ (Club) ===
// Tạo mới Club
app.post('/api/clubs', async (req, res) => {
    try {
        const newClub = new Club(req.body);
        await newClub.save();
        res.status(201).json(newClub);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách các câu lạc bộ
app.get('/api/clubs', async (req, res) => {
    try {
        const clubs = await Club.find();
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === API cho thông tin thành viên (Member) ===
// Tạo mới Member
app.post('/api/members', async (req, res) => {
    try {
        const newMember = new Member(req.body);
        await newMember.save();
        res.status(201).json(newMember);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách thành viên
app.get('/api/members', async (req, res) => {
    try {
        const members = await Member.find();
        res.json(members);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === API cho thông tin sự kiện (Event) ===
// Tạo mới Event
app.post('/api/events', async (req, res) => {
    try {
        const newEvent = new Event(req.body);
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách sự kiện
app.get('/api/events', async (req, res) => {
    try {
        const events = await Event.find();
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === API cho thông tin ngân sách (Budget) ===
// Tạo mới Budget
app.post('/api/budgets', async (req, res) => {
    try {
        const newBudget = new Budget(req.body);
        await newBudget.save();
        res.status(201).json(newBudget);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách ngân sách
app.get('/api/budgets', async (req, res) => {
    try {
        const budgets = await Budget.find();
        res.json(budgets);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === API cho thông tin báo cáo (Report) ===
// Tạo mới Report
app.post('/api/reports', async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách báo cáo
app.get('/api/reports', async (req, res) => {
    try {
        const reports = await Report.find();
        res.json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// === API cho thông tin giải thưởng (Prize) ===
// Tạo mới Prize
app.post('/api/prizes', async (req, res) => {
    try {
        const newPrize = new Prize(req.body);
        await newPrize.save();
        res.status(201).json(newPrize);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy danh sách giải thưởng
app.get('/api/prizes', async (req, res) => {
    try {
        const prizes = await Prize.find();
        res.json(prizes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Kết nối MongoDB và khởi chạy server
const startServer = async () => {
    await connectDB();  // Kết nối database
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
};

startServer();
