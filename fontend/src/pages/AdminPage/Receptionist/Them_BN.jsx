//BUTTON
const ButtonPrimary = ({ children, onClick }) => (
  <button 
    className="bg-[#45C3D2] text-sm text-white px-2 py-1 rounded hover:bg-[#e6b800] cursor-pointer transition mx-1"
    onClick={onClick}>{children}</button>);

// Text
const H1 = ({children, className}) => (
  <h1 className={`text-lg font-bold text-gray-800 ${className}`}>{children}</h1>
);
const SubTittle = ({ children }) => (
  <h6 className="text-gray-500 text-sm mb-1">{children}</h6>
);

// Input
const Input = (props) => (
  <input 
    {...props} // Truyền tất cả các props (type, name, id, placeholder, className, etc.)
    className={`border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-[#e6b800] focus:ring-[#e6b800] transition
      ${props.disabled 
        ? 'bg-gray-100 text-gray-500 cursor-not-allowed border-gray-300' // Style khi disabled
        : 'border-[1px] border-gray-300 rounded-md font-normal px-2 py-1 focus:border-[#e6b800] focus:ring-[#e6b800] transition' // Style khi active
      } ${props.className}`}
  />
);


// Thêm Bệnh Nhân Mới (Chưa đăng ký khám lần nào) hoặc chưa đăng ký trên web
const Them_BN = ({setContext}) => {
  return (
    <div className="px-2">
      {/* Breadcrumb */}
      <div className="text-[10px] text-gray-900 bg-white mb-2 mt-1 px-4 py-2 rounded-md">
        {/*Phần text "Quản lý bệnh nhân" được làm thành nút bấm */}
        {/* <span 
          className="cursor-pointer text-gray-600 hover:text-gray-900" 
          onClick={() => setContext("Quản lý Bệnh Nhân")}>
          Quản lý Bệnh Nhân 
        </span>
        &nbsp;&gt;&nbsp;  */}
        Thêm bệnh nhân mới
      </div>

      {/* Tittle */}
      <div className="flex items-center justify-between mb-2 bg-white p-4 rounded-md shadow">
        <h2>Thêm bệnh nhân mới</h2>
        <ButtonPrimary onClick={() => setContext("Quản lý Bệnh Nhân")}>
            Quét CCCD
        </ButtonPrimary>
      </div>

      {/* ----------THÔNG TIN CÁ NHÂN---------- */}
      <form className="w-full bg-white rounded-md px-5 py-4 shadow mb-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4 border-b-[1px] pb-2">Thông tin Cá nhân</h2>
        
        {/*HỌ VÀ TÊN - NGÀY SINH - NƠI SINH */}        
        <div className="mb-3 flex gap-x-6">
          <div className="w-2/3">
          <SubTittle>Họ và Tên (*)</SubTittle>
          <Input type="text" name="HovaTen" id="edt_HovaTen" className="w-full" placeholder="Nguyễn Văn A" />
        </div>
          {/*Nơi Sinh */}
          <div className="w-1/3">
            <SubTittle>Nơi Sinh</SubTittle>
            <Input type="text" name="NoiSinh" className="w-full" placeholder="Tỉnh/Thành phố" />
          </div>
          {/*Ngày Sinh*/}
          <div className="w-1/3">
            <SubTittle>Ngày Sinh (*)</SubTittle>
            <Input type="date" name="NamSinh" className="w-full" />
          </div>
        </div>

        {/*ĐỊA CHỈ THƯỜNG TRÚ*/}
        <div className="mb-3">
          <SubTittle>Địa chỉ Thường Trú (*)</SubTittle>
          <Input type="text" name="DiaChiThuongTru" className="w-full" placeholder="Số nhà, đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố" />
        </div>

        {/*ĐỊA CHỈ TẠM TRÚ */}
        <div className="mb-3">
          <SubTittle>Địa chỉ Tạm Trú</SubTittle>
          <Input type="text" name="DiaChiTamTru" className="w-full" placeholder="Tương tự thường trú nếu khác" />
        </div>
        
        {/*QUÊ QUÁN */}
        <div className="mb-3">
          <SubTittle>Quê Quán</SubTittle>
          <Input type="text" name="QueQuan" className="w-full" placeholder="Ví dụ: Hà Nội" />
        </div>
        
        {/*SỐ CCCD - NƠI CẤP - NGÀY CẤP*/}
        <div className="mb-3 flex gap-x-6">
          {/* Số CCCD */}
          <div className="w-1/3">
            <SubTittle>Số CCCD (*)</SubTittle>
            <Input type="number" name="SoCCCD" className="w-full" placeholder="12 số" />
          </div>
          {/* Nơi Cấp */}
          <div className="w-1/3">
            <SubTittle>Nơi Cấp (*)</SubTittle>
            <Input type="text" name="NoiCapCCCD" className="w-full" placeholder="Cục CS QLHC về TTXH" />
          </div>
          {/* Ngày Cấp */}
          <div className="w-1/3">
            <SubTittle>Ngày Cấp (*)</SubTittle>
            <Input type="date" name="NgayCapCCCD" className="w-full" />
          </div>
        </div>
        {/* BHYT */}
        <div className="mb-3 flex gap-x-6">
          {/* Số BHYT */}
          <div className="w-1/4">
            <SubTittle>Số Bảo Hiểm Y Tế (*)</SubTittle>
            <Input type="number" name="SoBHYT" className="w-full" placeholder="12 số" />
          </div>
          {/* Nơi Cấp */}
          <div className="w-1/4">
            <SubTittle>Nơi Cấp</SubTittle>
            <Input type="text" name="NoiCapBHYT" className="w-full" />
          </div>
          {/* Ngày Cấp */}
          <div className="w-1/4">
            <SubTittle>Ngày Cấp</SubTittle>
            <Input type="date" name="NgayCapBHYT" className="w-full" />
          </div>
          <div className="w-1/4">
            <SubTittle>Ngày hết hạn</SubTittle>
            <Input type="date" name="NgayHetHanBHYT" className="w-full" />
          </div>
        </div>

        {/* Liên hệ khẩn cấp */}
        <h6 className="text-lg font-bold text-gray-800 mb-4 border-b-[1px] pb-2 mt-8">Thông tin liên hệ khẩn cấp</h6>
        <div className="mb-3 flex gap-x-6">
          {/* Họ và tên người liên hệ khẩn cấp */}
          <div className="w-1/3">
            <SubTittle>Họ và Tên người liên hệ khẩn cấp 1 (*)</SubTittle>
            <Input type="text" name="HovaTenLHKhanCap" className="w-full"/>
          </div>
          {/* SĐT LH khẩn cấp */}
          <div className="w-1/3">
            <SubTittle>Số điện thoại liên hệ khẩn cấp 1 (*)</SubTittle>
            <Input type="number" name="SDTLHKhanCap" className="w-full"/>
          </div>
          {/* Mối quan hệ */}
          <div className="w-1/3">
            <SubTittle>Mối quan hệ 1 (*)</SubTittle>
            <Input type="text" name="MQHKhanCap" className="w-full" />
          </div>
        </div>

        <div className="mb-3 flex gap-x-6">
          {/* Họ và tên người liên hệ khẩn cấp */}
          <div className="w-1/3">
            <SubTittle>Họ và Tên người liên hệ khẩn cấp 2</SubTittle>
            <Input type="text" name="HovaTenLHKhanCap" className="w-full"/>
          </div>
          {/* SĐT LH khẩn cấp */}
          <div className="w-1/3">
            <SubTittle>Số điện thoại liên hệ khẩn cấp 2</SubTittle>
            <Input type="number" name="SDTLHKhanCap" className="w-full"/>
          </div>
          {/* Mối quan hệ */}
          <div className="w-1/3">
            <SubTittle>Mối quan hệ 2</SubTittle>
            <Input type="text" name="MQHKhanCap" className="w-full" />
          </div>
        </div>
        <div className="mb-3 flex gap-x-6">
          {/* Họ và tên người liên hệ khẩn cấp */}
          <div className="w-1/3">
            <SubTittle>Họ và Tên người liên hệ khẩn cấp 3</SubTittle>
            <Input type="text" name="HovaTenLHKhanCap" className="w-full"/>
          </div>
          {/* SĐT LH khẩn cấp */}
          <div className="w-1/3">
            <SubTittle>Số điện thoại liên hệ khẩn cấp 3</SubTittle>
            <Input type="number" name="SDTLHKhanCap" className="w-full"/>
          </div>
          {/* Mối quan hệ */}
          <div className="w-1/3">
            <SubTittle>Mối quan hệ 3</SubTittle>
            <Input type="text" name="MQHKhanCap" className="w-full" />
          </div>
        </div>
        {/* ----------END---------- */}
        
        {/* Nút gửi form */}
        <button type="submit" className="mt-4 bg-[#45C3D2] cursor-pointer text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition">
          Lưu thông tin
        </button>
      </form>
    </div>
  )
}

export default Them_BN