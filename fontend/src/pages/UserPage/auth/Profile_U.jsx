import { useState } from "react";

const Profile_U = ({ userData }) => {
  const defaultData = {
    full_name: "Trần Văn Nam",
    date_of_birth: "1998-05-22",
    phone_number: "0987654321",
    email: "nam.tv@example.com",
    card_id: "123456789012",
    permanent_address: "456 Đường A, Quận B, TP HCM",
    current_address: "456 Đường Lê Lợi, Quận 1, TP HCM",
    blood_type: "A",
    allergies: "Không có",
    relatives: [
      { name: "Trần Văn Hòa", relation: "Cha", phone: "0909123456" },
      { name: "Nguyễn Thị Hoa", relation: "Mẹ", phone: "0909988776" }
    ],
    medical_history: [
      { date: "2024-03-12", clinic: "PK Quận 1", diagnosis: "Cảm cúm" },
      { date: "2024-06-01", clinic: "PK Trung Tâm", diagnosis: "Khám định kỳ" }
    ]
  };

  const data = userData || defaultData;
  const [section, setSection] = useState("Thông tin cá nhân");

  const SidebarItem = ({ label }) => (
    <div
      onClick={() => setSection(label)}
      className={`cursor-pointer px-4 py-2 text-sm rounded-md mb-1 transition
        ${section === label ? "bg-[#FFC419] text-black font-semibold" : "hover:bg-gray-200 text-gray-700"}
      `}
    >
      {label}
    </div>
  );

  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <p className="font-medium text-gray-600">{label}:</p>
      <p className="text-right font-semibold text-gray-800">{value}</p>
    </div>
  );

  const renderContent = () => {
    switch (section) {
      case "Thông tin cá nhân":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Thông tin Cá nhân</h2>
            <DetailRow label="Họ và tên" value={data.full_name} />
            <DetailRow label="Ngày sinh" value={data.date_of_birth} />
            <DetailRow label="Số điện thoại" value={data.phone_number} />
            <DetailRow label="Email" value={data.email || "Chưa cập nhật"} />
            <DetailRow label="Số CCCD/CMND" value={data.card_id} />
            <DetailRow label="Địa chỉ thường trú" value={data.permanent_address} />
            <DetailRow label="Địa chỉ hiện tại" value={data.current_address} />
          </div>
        );

      case "Thông tin y tế":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Thông tin Y tế</h2>
            <DetailRow label="Nhóm máu" value={data.blood_type} />
            <DetailRow label="Dị ứng" value={data.allergies} />
          </div>
        );

      case "Thông tin người thân":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Thông tin Người thân</h2>
            {data.relatives.map((r, i) => (
              <div key={i} className="border-b border-gray-100 py-2">
                <p className="font-semibold text-gray-800">{r.name}</p>
                <p className="text-sm text-gray-600">
                  {r.relation} - {r.phone}
                </p>
              </div>
            ))}
          </div>
        );

      case "Thông tin hồ sơ":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Thông tin Hồ sơ</h2>
            <p>Hồ sơ bệnh nhân được cập nhật định kỳ theo từng lần khám.</p>
            <p className="mt-2 text-gray-700">Nếu có thay đổi, vui lòng liên hệ nhân viên tiếp tân để được hỗ trợ.</p>
          </div>
        );

      case "Lịch sử khám":
        return (
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-blue-600 mb-4">Lịch sử Khám bệnh</h2>
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="border p-2 text-left">Ngày khám</th>
                  <th className="border p-2 text-left">Phòng khám</th>
                  <th className="border p-2 text-left">Chuẩn đoán</th>
                </tr>
              </thead>
              <tbody>
                {data.medical_history.map((m, i) => (
                  <tr key={i}>
                    <td className="border p-2">{m.date}</td>
                    <td className="border p-2">{m.clinic}</td>
                    <td className="border p-2">{m.diagnosis}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f5f5]">
      {/* Sidebar */}
      <aside className="w-[230px] bg-white h-full shadow-md p-4 flex flex-col">
        <h1 className="text-xl font-bold text-[#FFC419] mb-4 text-center">Hồ sơ cá nhân</h1>

        <SidebarItem label="Thông tin cá nhân" />
        <SidebarItem label="Thông tin y tế" />
        <SidebarItem label="Thông tin người thân" />
        <SidebarItem label="Thông tin hồ sơ" />
        <SidebarItem label="Lịch sử khám" />

        <div className="mt-auto">
          <button className="w-full bg-red-500 text-white py-2 rounded-md mt-3 hover:bg-red-600">
            Đăng Xuất
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{renderContent()}</main>
    </div>
  );
};

export default Profile_U;
