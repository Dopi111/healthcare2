import React from 'react';

// Định nghĩa component Button
// Bây giờ nhận các props khác bằng cách spread ...props (ví dụ: type, disabled, aria-*, ...)
const Button = ({ children, className = '', ...props }) => (
  <button
    {...props}
    // Classes mặc định + nối thêm className tùy chỉnh (className cuối cùng để override nếu cần)
    className={`btn-secondary ${className}`}>
    {children}
  </button>
);

export default Button;