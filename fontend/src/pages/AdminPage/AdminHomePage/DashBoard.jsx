import { useState, useEffect } from "react";
// TIẾP TÂN
import DS_BN from "../Receptionist/DS_BN";
import Them_BN from "../Receptionist/Them_BN";
// BÁC SĨ
import Individual_Patient_Management from "../Doctor/Individual_Patient_Management"; //Quản lý bệnh nhân của bác sĩ
import Test_Result from "../Doctor/Test_Result"; //Phiếu xét nghiệm
import Work_Schedule from "../Doctor/Work_Schedule"; //Lịch làm việc của bác sĩ
// BÁC SĨ XÉT NGHIỆM/ CHỤP PHIM....
import Laboratory_Test_Report from "../DoctorOther/Laboratory_Test_Report"
import Test_Result_Form from "../DoctorOther/Test_Result_Form"
// HỆ THỐNG
import Appointment_List from "../System/Appointment_List"; //Danh sách cuộc hẹn
import Patient_List_Details from "../System/Patient_List_Details"; //Danh sách chi tiết thông tin bệnh nhân
// KẾ TOÁN
import Found_Management from "../Accounting/Fund_Management";
import SalaryManagement from "../Accounting/SalaryManagement";
//ĐĂNG NHẬP/ĐĂNG KÝ
import Login_E from "../Auth/Login_E"; 
import Register_E from "../Auth/Register_E"; 
import Profile_E from "../Auth/Profile_E";
import Add_Infor_E from "../Auth/Add_Infor_E";
import UpdateProfile_E from "../Auth/UpdateProfile_E";
//HOME PAGE
import Sidebar from './sidebar';
//ADMINSTATOR
import Accounts_Management from "../Adminstator/Accounts_Management";
import Employees_Management from "../Adminstator/Employees_Management";



    const renderAuthScreen = (props) => (
        <div className="flex items-center justify-center h-screen bg-[#f5f5f5]">
            {/*HIỂN THỊ COMPONENT ĐĂNG NHẬP HOẶC ĐĂNG KÝ */}
            {props.context === "Đăng nhập" && <Login_E setContext={props.setContext} />}
            {props.context === "Đăng ký" && <Register_E setContext={props.setContext} />}
        </div>
    );

const DashBoard = () => {
    //Mặc định
    const [context, setContext] = useState("Thông tin cá nhân");
    const getNavClasses = (navItem) => {
        // Classes mặc định
        const defaultClasses = "flex items-center text-[13px] text-black my-0.5 cursor-pointer px-3 py-2 rounded transition w-full truncate";
        const activeClasses = "bg-[#FFC419] font-semibold text-black"; 

        if (context === navItem) {
            return `${defaultClasses} ${activeClasses}`;
        }
        return defaultClasses;
    };

    //ĐỐI TƯỢNG CHỨA CÁC PROPS CẦN
    const dashboardProps = { context, setContext, getNavClasses };
//     useEffect(() => {
//     const initFromProfile = async () => {
//         try {
//             const employeeId = localStorage.getItem('employeeId');
//             const token = localStorage.getItem('token');
//             if (!employeeId || !token) return;

//             const res = await axios.get(`http://localhost:5001/api/employee/${encodeURIComponent(employeeId)}`, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (!res.data?.ok) return;
//             const dept = (res.data.data.department || '').trim();
            
//             //department trống hoặc null
//             if (!dept) {
//                 localStorage.setItem('department', '');
//                 setContext('Thông tin cá nhân');
//                 return; // dừng lại, không set gì thêm
//             }

//             //có phòng ban, lưu lại và xử lý theo vai trò
//             localStorage.setItem('department', dept);

//             const dep = dept.toLowerCase();

//             if (
//                 (dep.includes('bác sĩ chuyên') || dep.includes('bác sĩ chuyên khoa') || dep.includes('bác sĩ')) &&
//                 !dep.includes('kỹ thuật')
//             ) {
//                 setContext('Quản lý BN cá nhân'); 
//                 return;
//             }

//             if (dep.includes('kỹ thuật') || dep.includes('bác sĩ kỹ thuật')) {
//                 setContext('Kết quả xét nghiệm');
//                 return;
//             }

//             if (dep.includes('kế toán')) {
//                 setContext('Quản lý Quỹ'); 
//                 return;
//             }

//             // Nếu không trùng bất kỳ điều kiện nào
//             setContext('Thông tin cá nhân');

//         } catch (err) {
//             console.error('Lỗi khi khởi tạo từ hồ sơ:', err);
//             setContext('Thông tin cá nhân');
//         }
//     };
//     initFromProfile();
// }, []);


    return (
        <div className="flex h-screen">
            <Sidebar getNavClasses={getNavClasses} setContext={setContext} context={context} />

            <div className="flex flex-col flex-1 h-screen">

                <main className="flex-1 bg-[#f5f5f5] overflow-y-auto">
                    {/* PROFILE EMPLOYEE */}
                    {context === "Thông tin cá nhân" && <Profile_E setContext={setContext} />}
                    {context === "Chỉnh sửa thông tin nhân viên " && <UpdateProfile_E setContext={setContext}/>}
                    {context === "Thêm thông tin nhân viên" && <Add_Infor_E setContext={setContext} />}

                    {/* ADMINSTATOR */}
                    {context === "Quản lý tài khoản" && <Accounts_Management setContext={setContext} />}
                    {context === "Quản lý nhân viên" && <Employees_Management setContext={setContext} />}

                    {/* TIẾP TÂN */}
                    {context === "Thêm BN mới" && <Them_BN setContext={setContext} />}
                    {context === "Danh sách BN" && <DS_BN setContext={setContext} />}
                    
                    {/* BÁC SĨ */}
                    {context === "Quản lý BN cá nhân" && <Individual_Patient_Management setContext={setContext} />}
                    {context === "Quản lý phiếu" && <Test_Result setContext={setContext} />}
                    {context === "Quản lý kết quả xét nghiệm" && <div>Quản lý kết quả xét nghiệm</div>}
                    {context === "Quản lý lịch làm việc" && <Work_Schedule setContext={setContext} />}

                    {/* BÁC SĨ XÉT NGHIỆM/ CHỤP PHIM.... */}
                    {context === "Kết quả xét nghiệm" && <Laboratory_Test_Report setContext={setContext} />}
                    {context === "Nhận phiếu xét nghiệm" && <Test_Result_Form setContext={setContext} />}

                    {/* KẾ TOÁN */}
                    {context === "Quản lý Quỹ" && <Found_Management setContext={setContext} />}
                    {context === "Quản lý Lương" && <SalaryManagement setContext={setContext} />}
                    {context === "DT Khám & Chữa Bệnh" && <div>DT Khám & Chữa Bệnh</div>}
                    {context === "Chi Phí HĐ" && <div>Chi Phí HĐ</div>}
                    {context === "QL TT Bảo Hiểm" && <div>QL TT Bảo Hiểm</div>}

                    {/* HỆ THỐNG */}
                    {context === "Danh sách lịch hẹn BN" && <Appointment_List setContext={setContext} />}
                    {context === "Danh sách chi tiết BN" && <Patient_List_Details setContext={setContext} />}
                </main>
            </div>
        </div>
    );
};
export default DashBoard;