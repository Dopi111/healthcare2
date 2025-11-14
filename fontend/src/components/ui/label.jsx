import React from 'react';

const Label = ({ children, htmlFor, className = "" }) => (
  // Sử dụng thẻ <label> chuẩn HTML cho ngữ nghĩa tốt
  <label
    // htmlFor: Thuộc tính quan trọng giúp liên kết nhãn với Input bằng id
    htmlFor={htmlFor} 
    
    // Classes mặc định: Kích thước nhỏ, font medium, margin dưới nhỏ
    className={`block text-sm font-medium mb-1 text-gray-700 ${className}`}
  >
    {children}
  </label>
);

export default Label;