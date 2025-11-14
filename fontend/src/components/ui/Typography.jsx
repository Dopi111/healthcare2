import React from 'react';

// Ánh xạ 'variant' sang Thẻ HTML và Lớp Tailwind tương ứng
const variantMap = {
  h1: { tag: 'h1', classes: 'text-h1-size leading-h1-line font-bold text-text-dark' },
  h2: { tag: 'h2', classes: 'text-h2-size leading-h2-line font-semibold text-text-dark' },
  h3: { tag: 'h3', classes: 'text-h3-size leading-h3-line font-medium text-text-dark' },
  h4: { tag: 'h4', classes: 'text-h4-size leading-h4-line text-text-dark' },
  p: { tag: 'p', classes: 'text-p-size leading-p-line text-text-base' },
  span: { tag: 'span', classes: 'text-p-size leading-p-line text-text-base' },
  caption: { tag: 'span', classes: 'text-caption-size leading-caption-line text-text-light' },
};

/**
 * Component Typography chung cho H1, H2, P, v.v.
 * @param {string} variant - Chọn loại thẻ (h1, h2, p, span, caption)
 * @param {string} className - Lớp Tailwind CSS tùy chỉnh
 * @param {React.ReactNode} children - Nội dung bên trong thẻ
 */
const Typography = ({ variant = 'p', className = '', children, ...props }) => {
  
  // Lấy cấu hình từ variantMap
  const { tag: Tag, classes: baseClasses } = variantMap[variant] || variantMap.p;
  
  return (
    // Sử dụng biến Tag để render thẻ HTML tương ứng
    <Tag className={`${baseClasses} ${className}`} {...props}>
      {children}
    </Tag>
  );
};

export default Typography;