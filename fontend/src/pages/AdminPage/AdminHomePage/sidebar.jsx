import React from 'react';

const TextTittle = ({children}) => (
    <h6 className="text-[12px] text-gray-700 w-full py-1 px-2 mt-3 font-medium">{children}</h6>
);

// Sidebar component expects getNavClasses(navItem) and setContext(fn)
const Sidebar = ({ getNavClasses, setContext, context }) => {
    return (
        <aside className="h-screen overflow-y-auto w-[200px] bg-white text-black flex flex-col items-start box-border shadow p-3 gap-2">
            <div className="bg-[#EDFFFA] text-[#FFC419] text-[20px] font-bold mb-3 px-3 py-1.5 rounded-md w-full text-center">HealthCare</div>
            {/* THÔNG TIN CHUNG */}
            <div className={'w-full rounded-md ' + (context === 'Thông tin cá nhân' ? 'bg-[#FFF4D6]' : '')}>
                <div className={getNavClasses("Thông tin cá nhân")} onClick={() => setContext("Thông tin cá nhân")}>Thông tin cá nhân</div>
                <div className={getNavClasses("Thêm thông tin nhân viên")} onClick={() => setContext("Thêm thông tin nhân viên")}>Thêm thông tin nhân viên</div>
            </div>
            {/* QUẢN TRỊ HỆ THỐNG */}
            <div className={'w-full rounded-md ' + (context === 'Thông tin cá nhân' ? 'bg-[#FFF4D6]' : '')}>
                <div className={getNavClasses("Quản lý tài khoản")} onClick={() => setContext("Quản lý tài khoản")}>Quản lý tài khoản</div>
                <div className={getNavClasses("Quản lý nhân viên")} onClick={() => setContext("Quản lý nhân viên")}>Quản lý nhân viên</div>
            </div>

            {/* DÀNH CHO TIẾP TÂN */}
            <div className={'w-full rounded-md ' + (["Thêm BN mới", "Danh sách BN"].includes(context) ? 'bg-[#FFF4D6]' : '')}>
                <TextTittle>Tiếp Tân</TextTittle>
                <div className={getNavClasses("Thêm BN mới")} onClick={() => setContext("Thêm BN mới")}>Thêm BN mới</div>
                <div className={getNavClasses("Danh sách BN")} onClick={() => setContext("Danh sách BN")}>Danh sách BN</div>
            </div>

            {/* DÀNH CHO BÁC SĨ */}
            <div className={'w-full rounded-md ' + (["Quản lý BN cá nhân","Quản lý phiếu","Quản lý kết quả xét nghiệm","Quản lý lịch làm việc"].includes(context) ? 'bg-[#FFF4D6]' : '')}>
                <TextTittle>Bác Sĩ</TextTittle>
                <div className={getNavClasses("Quản lý BN cá nhân")} onClick={() => setContext("Quản lý BN cá nhân")}>Quản lý BN cá nhân</div>
                <div className={getNavClasses("Quản lý phiếu")} onClick={() => setContext("Quản lý phiếu")}>Quản lý phiếu</div>
                <div className={getNavClasses("Quản lý kết quả xét nghiệm")} onClick={() => setContext("Quản lý kết quả xét nghiệm")}>Quản lý kết quả xét nghiệm</div>
                <div className={getNavClasses("Quản lý lịch làm việc")} onClick={() => setContext("Quản lý lịch làm việc")}>Quản lý lịch làm việc</div>
            </div>

            {/* DÀNH CHO BÁC SĨ XÉT NGHIỆM ... */}
            <div className={'w-full rounded-md ' + (["Nhận phiếu xét nghiệm","Kết quả xét nghiệm"].includes(context) ? 'bg-[#FFF4D6]' : '')}>
                <TextTittle>Bác Sĩ Xét Nghiệm</TextTittle>
                <div className={getNavClasses("Nhận phiếu xét nghiệm")} onClick={() => setContext("Nhận phiếu xét nghiệm")}>Nhận phiếu xét nghiệm</div>
                <div className={getNavClasses("Kết quả xét nghiệm")} onClick={() => setContext("Kết quả xét nghiệm")}>Kết quả xét nghiệm</div>
            </div>

            {/* DÀNH CHO KẾ TOÁN */}
            <div className={'w-full rounded-md ' + (["Quản lý Quỹ","Quản lý Lương","DT Khám & Chữa Bệnh","QL TT Bảo Hiểm","Chi Phí HĐ"].includes(context) ? 'bg-[#FFF4D6]' : '')}>
                <TextTittle>Kế Toán</TextTittle>
                <div className={getNavClasses("Quản lý Quỹ")} onClick={() => setContext("Quản lý Quỹ")}>Quản lý Quỹ</div>
                <div className={getNavClasses("Quản lý Lương")} onClick={() => setContext("Quản lý Lương")}>Quản lý Lương</div>
                <div className={getNavClasses("DT Khám & Chữa Bệnh")} onClick={() => setContext("DT Khám & Chữa Bệnh")}>DT Khám & Chữa Bệnh</div>
                <div className={getNavClasses("QL TT Bảo Hiểm")} onClick={() => setContext("QL TT Bảo Hiểm")}>QL TT Bảo Hiểm</div>
                <div className={getNavClasses("Chi Phí HĐ")} onClick={() => setContext("Chi Phí HĐ")}>Chi Phí HĐ</div>
            </div>

            {/* DÀNH CHO HỆ THỐNG */}
            <div className={'w-full rounded-md ' + (["Danh sách lịch hẹn BN","Danh sách chi tiết BN"].includes(context) ? 'bg-[#FFF4D6]' : '')}>
                <TextTittle>Hệ Thống</TextTittle>
                <div className={getNavClasses("Danh sách lịch hẹn BN")} onClick={() => setContext("Danh sách lịch hẹn BN")}>Danh sách Lịch hẹn BN</div>
                <div className={getNavClasses("Danh sách chi tiết BN")} onClick={() => setContext("Danh sách chi tiết BN")}>Danh sách chi tiết BN</div>
            </div>
        </aside>
    );
};

export default Sidebar;
