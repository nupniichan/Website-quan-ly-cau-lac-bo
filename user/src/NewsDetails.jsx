import newdetails1 from '../public/imgs/newdetails1.jpg';
import newdetails2 from '../public/imgs/newsdetail2.jpg';

const NewsDetails = () => {
  return (
    <div className="p-12 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center" style={{ color: '#004D86' }}>Học sinh hào hứng trải nghiệm sự &#39;thay da đổi thịt&#39; của trường</h1>
      
      <p className="mb-4">Sau thời gian dài mong đợi, ngôi trường đã hoàn thành dự án cải tạo và nâng cấp cơ sở vật chất. Không gian học tập được mở rộng với lớp học thông đãng, hệ thống ánh sáng và thiết bị hiện đại, mang lại sự phấn khởi cho các em học sinh.</p>
      
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic">
        &quot;Em rất thích phòng học mới, đầy đủ tiện nghi hơn và không gian thoáng mát giúp em tập trung hơn trong giờ học.&quot;
        <footer className="text-sm text-gray-600 mt-2">- Em Nguyễn Minh Anh, học sinh lớp 10, chia sẻ</footer>
      </blockquote>
      <figure className="mb-6">
        <img src={newdetails1} alt="Phòng học mới sau khi được cải tạo" className="w-full h-auto rounded-lg" />
        <figcaption className="text-sm text-gray-600 mt-2 text-center">( Phòng học mới sau khi được cải tạo )</figcaption>
      </figure>
      
      <p className="mb-4">Ngôi trường đã được trang bị thêm nhiều tiện nghi hiện đại như phòng máy tính, phòng thí nghiệm khoa học, và khu vực sinh hoạt chung đầy sáng tạo. Đây là những bước tiến mới giúp học sinh có thêm nhiều cơ hội trải nghiệm thực hành và phát triển kỹ năng mềm.</p>
      
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 mb-4 italic">
        &quot;Trường mình giờ nhìn đẹp hơn rất nhiều, chúng em có nhiều không gian để học nhóm và sinh hoạt ngoại khóa hơn. Mọi người ai cũng cảm thấy hứng thú hơn mỗi khi đến trường.&quot;
        <footer className="text-sm text-gray-600 mt-2">- Em Trần Quang Minh, học sinh lớp 12, chia sẻ</footer>
      </blockquote>
      
      <figure className="mb-6">
        <img src={newdetails2} alt="Ngôi trường sau khi đã được cải tạo" className="w-full h-auto rounded-lg" />
        <figcaption className="text-sm text-gray-600 mt-2 text-center">(Ngôi trường sau khi đã được cải tạo)</figcaption>
      </figure>
      
      <p className="mb-4">Sự thay đổi vượt bậc của trường với sân bóng mới, khuôn viên xanh mát, cùng các lớp học được trang bị thiết bị hiện đại đã khiến tinh thần học tập của học sinh phấn khởi. &quot;Em rất thích trường với sân bóng mới, rộng rãi và đẹp hơn trước rất nhiều. Giờ đây, tụi em có thể thoải mái chơi thể thao sau giờ học,&quot; học sinh Lê Đức Anh chia sẻ.</p>
      
      <p className="mb-4">Các hoạt động ngoại khóa cũng hứa hẹn sẽ sôi động hơn với không gian mới. Nhà trường đã tổ chức thường xuyên hơn các hoạt động thể thao và các câu lạc bộ học thuật khác.</p>
    </div>
  );
};

export default NewsDetails;
