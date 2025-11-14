const ButtonPrimary = ({ children, onClick }) => (
  <button 
    className="bg-[#45C3D2] text-sm text-white px-2 py-1 rounded hover:bg-[#e6b800] cursor-pointer transition mx-1"
    onClick={onClick}>{children}</button>);

// Quản lý bệnh nhân đã khám bệnh
const DS_BN_DaKham = ({setContext}) => {
  return (
    <div className="px-2">
      {/* Breadcrumb */}
        <div className="text-[10px] text-gray-900 bg-white mb-2 mt-1 px-4 py-2 rounded-md">
            {/*Phần text "Quản lý bệnh nhân" được làm thành nút bấm */}
            {/* &nbsp;&gt;&nbsp;  */}
            Danh sách bệnh nhân
        </div>
        {/* Tittle */}
        <div className="flex items-center justify-between mb-2 bg-white p-4 rounded-md shadow">
            <div>
                <h2 className="text-xl font-bold text-[#222]">Danh sách Bệnh Nhân</h2>
                <h6 className="text-gray-500 text-sm"></h6>
            </div>
            <div>
                <button className="bg-[#45C3D2] text-sm text-white px-2 py-1 rounded hover:bg-[#e6b800] cursor-pointer transition mx-1">Đăng ký khám bệnh</button>
                <ButtonPrimary onClick={() => setContext("Thêm BN mới")}>Thêm bệnh nhân</ButtonPrimary> 
            </div>
        </div>

        {/* Tìm kiếm*/}
        <div className="bg-white p-2 mb-4 rounded-md shadow flex items-center gap-5">
            <input type="text" placeholder="Tìm kiếm tên bệnh nhân, CCCD, mã bệnh nhân" className="w-[500px] flex border-[1px] border-gray-300 rounded-md px-2"/>
            <div className="flex items-center border-[1px] border-gray-300 rounded-md px-2 py-1 h-[27px]">
                <label className="text-sm mr-2">Ngày ĐK PK:</label>
                <input type="date"/>
            </div>
            <button className="bg-[#45C3D2] text-sm text-white px-4 py-2 rounded hover:bg-[#e6b800] cursor-pointer transition">Tìm kiếm</button>
        </div>

        {/* Sắp xếp */}
        <div className="w-ful my-2 bg-white rounded-md shadow p-2 flex items-center justify-end">
            <select className="border-2 border-gray-300 rounded-md px-2 text-[14px]">
                <option>Sắp xếp theo ngày đăng ký</option>
                <option>Ngày cũ dần</option>
                <option>Ngày mới dần</option>
            </select>
            <select className="border-2 border-gray-300 rounded-md px-2 mx-2 text-sm">
                <option>Sắp xếp theo tuổi</option>
                <option>Tuổi tăng dần</option>
                <option>Tuổi giảm dần</option>
            </select>
            <button className="bg-[#ccc] text-sm text-gray-950 text-sm px-2 py-1 rounded hover:bg-[#e6b800] cursor-pointer transition">Xoá sắp xếp</button>
        </div>
        
        {/* Bảng danh sách khách hàng mẫu */}
        <div className="overflow-x-auto bg-white bounded-md">
            <table className="min-w-full">
            <thead>
                <tr>
                <th className="py-2 px-4 border-b text-left">STT</th>
                <th className="py-2 px-4 border-b text-left">Họ tên</th>
                <th className="py-2 px-4 border-b text-left">Số điện thoại</th>
                <th className="py-2 px-4 border-b text-left">Email</th>
                <th className="py-2 px-4 border-b text-left">Thao tác</th>
                </tr>
            </thead>
            <tbody>
                <tr className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">1</td>
                <td className="py-2 px-4 border-b">Nguyễn Văn A</td>
                <td className="py-2 px-4 border-b">0901234567</td>
                <td className="py-2 px-4 border-b">a.nguyen@email.com</td>
                <td className="py-2 px-4 border-b">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">Sửa</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Xoá</button>
                </td>
                </tr>
                <tr className="hover:bg-gray-100">
                <td className="py-2 px-4 border-b">2</td>
                <td className="py-2 px-4 border-b">Trần Thị B</td>
                <td className="py-2 px-4 border-b">0912345678</td>
                <td className="py-2 px-4 border-b">b.tran@email.com</td>
                <td className="py-2 px-4 border-b">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded mr-2 hover:bg-blue-600">Sửa</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">Xoá</button>
                </td>
                </tr>
                {/* Thêm các dòng khác nếu muốn */}
            </tbody>
            </table>
      </div>
    </div>
  );
};

export default DS_BN_DaKham;