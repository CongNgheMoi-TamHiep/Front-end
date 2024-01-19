import React from "react";

const TinNhan = () => {
  return (
    <div className="conversation">
      <header id="header-conver">
        <h1 className="title">Chào mừng đến với Zola PC!</h1>
        <p className="description">
          Khám phá những tiện ích hỗ trợ làm việc và trò chuyện cùng người thân,
          bạn bè được tối ưu hoá cho máy tính của bạn.
        </p>
      </header>
      <div className="image-desc">
        <img
          src="https://chat.zalo.me/assets/quick-message-onboard.3950179c175f636e91e3169b65d1b3e2.png"
          alt=""
          width={"100%"}
          height={"330px"}
          style={{ objectFit: "cover", marginBottom: "30px" }}
        />
      </div>
      <section id="end-to-end-encryption">
        <h2 className="title">Mã hóa đầu cuối</h2>
        <p className="description">
          Nội dung tin nhắn được mã hóa trong suốt quá trình gửi và nhận.
        </p>
        <a href="https://help.zalo.me/huong-dan/chuyen-muc/nhan-tin-va-goi/nhan-tin/ma-hoa-dau-cuoi-bao-mat-toi-uu-cho-tro-chuyen/?gidzl=aZcCKsN72ssH88bLPDm9QvWcZbnptrWoq2RO277M2ZVGVOvP9zKEDD4iZmWiWmjbtodTMsJ5oRCFPSK7Q0">
          Tìm hiểu thêm
        </a>
      </section>
    </div>
  );
};

export default TinNhan;
