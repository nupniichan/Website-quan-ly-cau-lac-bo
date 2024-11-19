import admissionstandard1 from "../public/imgs/admissionstandard1.jpg";
import admissionstandard2 from "../public/imgs/admissionstandard2.jpg";
import admissionstandard3 from "../public/imgs/admissionstandard3.jpg";

const AdmissionStandard = () => {
    return (
        <div className="container mx-auto px-4 py-8">
            <h1
                className="text-3xl font-bold mb-6 text-center"
                style={{ color: "#004D86" }}
            >
                ĐIỂM CHUẨN TUYỂN SINH LỚP 10
            </h1>

            <div className="mb-6">
                <p className="mb-4">
                    Với số điểm hiện tại, chúng tôi có thể tự hào thông báo rằng
                    điểm chuẩn tuyển sinh vào lớp 10 năm 2024 của trường là{" "}
                    <span className="font-bold">[28 điểm]</span>.
                </p>

                <p className="mb-4">
                    Điều này không chỉ thể hiện chất lượng giáo dục mà còn là sự
                    nỗ lực không ngừng của các thầy cô giáo và học sinh trong
                    suốt thời gian qua. Chúng tôi tin rằng đây sẽ là môi trường
                    học tập tốt nhất để các em phát triển toàn diện, từ kiến
                    thức đến kỹ năng sống.
                </p>

                <p>
                    Chúng tôi xin chúc mừng các em học sinh đã đủ điều kiện
                    trúng tuyển vào trường và mong rằng các em sẽ tiếp tục phát
                    huy năng lực của mình để đạt được nhiều thành công trong
                    tương lai!
                </p>
            </div>

            <h2 className="text-xl font-bold mb-4" style={{ color: "#004D86" }}>
                DANH SÁCH ĐIỂM CHUẨN TUYỂN SINH LỚP 10 THPT TP.HCM NĂM 2024
            </h2>

            <div className="space-y-4 flex flex-col items-center">
                <img
                    src={admissionstandard1}
                    alt="Admission Standard 1"
                    className="w-3/4 md:w-1/2 rounded-lg shadow-md"
                />
                <img
                    src={admissionstandard2}
                    alt="Admission Standard 2"
                    className="w-3/4 md:w-1/2 rounded-lg shadow-md"
                />
                <img
                    src={admissionstandard3}
                    alt="Admission Standard 3"
                    className="w-3/4 md:w-1/2 rounded-lg shadow-md"
                />
            </div>
            <br />
            <h2 className="text-xl font-bold mb-4" style={{ color: "#004D86" }}>
                Điểm xét tuyển vào lớp 10 được tính như sau:
            </h2>
            <p className="mb-4">
                <b>
                    Điểm xét tuyển = Điểm thi môn ngữ văn + Điểm thi môn ngoại
                    ngữ + điểm thi môn toán + điểm ưu tiên, khuyến khích (nếu
                    có).
                </b>{" "}
                <br />
                Sở GDĐT TPHCM chỉ xét tuyển đối với thí sinh được tham gia thi
                tuyển, đã thi đủ các bài thi quy định, không vi phạm quy chế thi
                tuyển sinh và không có bài thi nào bị điểm 0.
            </p>
            <h2 className="text-xl font-bold mb-4" style={{ color: "#004D86" }}>
                Về phía thí sinh, sau khi biết điểm chuẩn lớp 10 và danh sách
                trúng tuyển vào các trường THPT công lập, từ ngày 4/7 đến 16 giờ
                ngày 1/8, thí sinh trúng tuyển nộp hồ sơ nhập học tại trường đã
                trúng tuyển.
            </h2>
            <p className="mb-4">
                Về phía thí sinh, sau khi biết điểm chuẩn lớp 10 và danh sách
                trúng tuyển vào các trường THPT công lập, từ ngày 4/7 đến 16 giờ
                ngày 1/8, thí sinh trúng tuyển nộp hồ sơ nhập học tại trường đã
                trúng tuyển.
            </p>
            <p className="mb-4">
                Nếu thí sinh không nộp hồ sơ nhập học thì trường sẽ xóa tên
                trong danh sách trúng tuyển. Các trường THPT không nhận thí sinh
                ngoài danh sách trúng tuyển.
            </p>
            <p className="mb-4">
                Sau khi các trường THPT nhận hồ sơ nhập học vào lớp 10, Sở GDĐT
                TPHCM sẽ xem xét tình hình và quyết định về việc tuyển bổ sung
                đợt 2.
            </p>
            <p className="mb-4">
                Năm nay, kỳ thi tuyển sinh vào lớp 10 công lập diễn ra trong 2
                ngày 6 và 7-6. Toàn thành phố có hơn 98.000 thí sinh đăng ký dự
                thi. Tổng chỉ tiêu vào 113 trường THPT công lập trên địa bàn là
                77.350 chỉ tiêu.
            </p>
            <p className="mb-4">
                Căn cứ vào chỉ tiêu tuyển sinh, số lượng thí sinh đăng ký nguyện
                vọng và tổng điểm 3 bài thi của thí sinh, Sở GDĐT TPHCM sẽ xét
                duyệt và công bố điểm chuẩn của từng trường theo nguyên tắc điểm
                chuẩn nguyện vọng 2 không thấp hơn điểm chuẩn nguyện vọng 1 và
                điểm chuẩn nguyện vọng 3 không thấp hơn điểm chuẩn nguyện vọng
                2.
            </p>
            <p className="mb-4">
                Danh sách trúng tuyển sẽ căn cứ vào 3 nguyện vọng thí sinh đăng
                ký theo thứ tự ưu tiên từ nguyện vọng 1 đến nguyện vọng 2 và
                nguyện vọng 3.
            </p>
            <p className="mb-4">
                Năm học 2023-2024, Trường THPT Nguyễn Thượng Hiền (quận Tân
                Bình) dẫn đầu danh sách điểm chuẩn với 25,5 điểm (nguyện vọng
                1). Kế đến là Trường THPT Gia Định (quận Bình Thạnh) với 24,5
                điểm và Trường THPT Nguyễn Thị Minh Khai (quận 3) với 24,25
                điểm./.
            </p>
        </div>
    );
};

export default AdmissionStandard;
