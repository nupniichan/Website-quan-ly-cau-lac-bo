import React from 'react';
import curriculum from '../public/imgs/curriculum.jpg';
const Curriculum = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-[#004D86] mb-6">CHƯƠNG TRÌNH ĐÀO TẠO</h1>
      
      <p className="mb-4 text-gray-700">
        Căn cứ theo tiêu mục 2 Mục 4 Chương trình giáo dục phổ thông do Bộ trưởng Bộ Giáo dục và
        Đào tạo ban hành kèm theo <a href='https://moet.gov.vn/content/vanban/Lists/VBPQ/Attachments/1483/vbhn-ttu-322018-202021-132022-ttbgddt.pdf' className='underline'>Thông tư 32/2018/TT-BGDĐT (được sửa đổi bởi khoản 1 Điều 1 Thông tư 13/2022/TT-BGDĐT)</a> như sau:
      </p>
      
      <p className="mb-6 text-gray-700">
        Mỗi ngày học 1 buổi, mỗi buổi không bố trí quá 5 tiết học; mỗi tiết học 45 phút. Khuyến khích
        các trường trung học phổ thông đủ điều kiện thực hiện dạy học 2 buổi/ngày theo hướng dẫn
        của Bộ Giáo dục và Đào tạo.
      </p>
      
      <h2 className="text-2xl font-semibold mb-4 text-[#004D86]">Bảng tổng hợp kế hoạch giáo dục cấp trung học phổ thông</h2>
      
      <figure className="mb-6">
      <img src={curriculum} alt="Chương trình đào tạo" className="w-3/4 md:w-1/2 rounded-lg shadow-md" />
      <figcaption className="text-sm text-gray-600 mt-2 text-center">( Chương trình đào tạo theo thông tư)</figcaption>
      </figure>
      
      <div className="mt-4">
        <p className="text-gray-700 mb-6 text-md">
          Đối chiếu quy định trên thì <b>các môn học bắt buộc</b> ở THPT 2024 sẽ gồm: Ngữ văn; Toán; Ngoại ngữ 1; Giáo dục thể chất; Giáo dục quốc phòng và an ninh. <br/>
          Đồng thời thì <b>thời lượng học các môn học bắt buộc</b> ở THPT 2024 như sau: <br/>
          Môn Ngữ văn, Toán, Ngoại ngữ 1: <b>105 tiết học</b><br/>
          Môn Giáo dục thể chất: <b>70 tiết học</b> <br/>
          Môn Giáo dục quốc phòng và an ninh: <b>35 tiết học</b> <br/>
        </p>
      </div>
    </div>
  );
};

export default Curriculum;

