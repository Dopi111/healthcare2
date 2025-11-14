const ActionButton = ({ children, colorClass, onClick }) => (
    <button
        className={`px-4 py-2 text-white rounded-md font-semibold transition hover:opacity-90 ${colorClass}`}
        onClick={onClick}
    >
        {children}
    </button>
);

const Found_Management = ({ setContext }) => {
    // Dữ liệu mẫu (Sample Data)
    const soDuHienTai = "1,540,000,000 VND";
    const cacGiaoDich = [
        { id: 1, loai: 'Thu', moTa: 'Thanh toán Khám bệnh BN345', soTien: '+2,500,000', ngay: '14/10/2025' },
        { id: 2, loai: 'Chi', moTa: 'Thanh toán tiền điện nước tháng 9', soTien: '-8,200,000', ngay: '14/10/2025' },
        { id: 3, loai: 'Thu', moTa: 'Thu tạm ứng dịch vụ X', soTien: '+15,000,000', ngay: '13/10/2025' },
        { id: 4, loai: 'Chi', moTa: 'Chi lương tạm ứng NV005', soTien: '-5,000,000', ngay: '12/10/2025' },
    ];

    // Hàm xử lý (giả định)
    const handleThuQuy = () => alert("Mở form Thêm phiếu Thu");
    const handleChiQuy = () => alert("Mở form Thêm phiếu Chi");
    
    return (
        <div className="p-4 bg-[#f5f5f5] h-full">
            
            {/* 1. Breadcrumb (Quay lại trang chính QL Doanh thu) */}
            <div className="text-[10px] text-gray-900 bg-white mb-4 mt-1 px-4 py-2 rounded-md">
                <span 
                    className="cursor-pointer text-gray-600 hover:text-gray-900" 
                    onClick={() => setContext("QL Doanh thu")}
                >
                    QL Doanh thu 
                </span>
                &nbsp;&gt;&nbsp; Quản lý Quỹ
            </div>

            {/* 2. Tổng quan & Nút hành động */}
            <div className="flex justify-between items-start mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý Quỹ Tiền Mặt</h1>
                <div className="flex space-x-3">
                    <ActionButton colorClass="bg-green-600" onClick={handleThuQuy}>
                        ➕ Thêm Phiếu Thu
                    </ActionButton>
                    <ActionButton colorClass="bg-red-500" onClick={handleChiQuy}>
                        ➖ Thêm Phiếu Chi
                    </ActionButton>
                </div>
            </div>

            {/* 3. Thẻ Tổng quan (Cards) */}
            <div className="grid grid-cols-3 gap-6 mb-6">
                {/* Thẻ 1: Số Dư Hiện Tại */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
                    <p className="text-sm font-medium text-gray-500">SỐ DƯ HIỆN TẠI</p>
                    <h2 className="text-3xl font-extrabold text-blue-700 mt-1">
                        {soDuHienTai}
                    </h2>
                </div>
                
                {/* Thẻ 2: Tổng Thu trong Ngày */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                    <p className="text-sm font-medium text-gray-500">TỔNG THU (Hôm nay)</p>
                    <h2 className="text-3xl font-extrabold text-green-700 mt-1">
                        +35,000,000 VND
                    </h2>
                </div>
                
                {/* Thẻ 3: Tổng Chi trong Ngày */}
                <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                    <p className="text-sm font-medium text-gray-500">TỔNG CHI (Hôm nay)</p>
                    <h2 className="text-3xl font-extrabold text-red-700 mt-1">
                        -12,500,000 VND
                    </h2>
                </div>
            </div>

            {/* 4. Danh sách Giao dịch Gần đây */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-bold mb-4 border-b pb-2">Giao dịch Gần đây</h3>
                
                {/* Thanh Lọc */}
                <div className="flex space-x-4 mb-4">
                    <select className="border rounded-md p-2 text-sm">
                        <option>Tất cả Giao dịch</option>
                        <option>Phiếu Thu</option>
                        <option>Phiếu Chi</option>
                    </select>
                    <input type="date" className="border rounded-md p-2 text-sm"/>
                    <input type="text" placeholder="Tìm kiếm theo mô tả..." className="border rounded-md p-2 text-sm w-1/3"/>
                    <ActionButton colorClass="bg-gray-500" className="text-xs">Lọc</ActionButton>
                </div>

                {/* Bảng Giao dịch */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loại</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mô tả</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Số tiền</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {cacGiaoDich.map((giaoDich) => (
                            <tr key={giaoDich.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{giaoDich.ngay}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${giaoDich.loai === 'Thu' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {giaoDich.loai}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{giaoDich.moTa}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-bold text-right ${giaoDich.loai === 'Thu' ? 'text-green-600' : 'text-red-600'}`}>
                                    {giaoDich.soTien}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button className="text-blue-600 hover:text-blue-900">Chi tiết</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    );
};

export default Found_Management;