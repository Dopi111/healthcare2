# Admin Components

Bộ components UI cho Admin Dashboard của hệ thống HealthCare.

## Components

### 1. AdminLayout
Layout chính cho admin dashboard với sidebar và header.

```jsx
import { AdminLayout } from '@/components/admin';

<AdminLayout context={context} setContext={setContext} getNavClasses={getNavClasses}>
  {/* Nội dung trang */}
</AdminLayout>
```

**Props:**
- `context`: (string) Context hiện tại
- `setContext`: (function) Hàm set context
- `getNavClasses`: (function) Hàm lấy classes cho nav items
- `children`: (ReactNode) Nội dung trang

**Features:**
- Responsive với mobile sidebar
- Sticky header và sidebar
- Auto-close mobile sidebar khi chuyển trang

---

### 2. DataTable
Component bảng dữ liệu với sorting và pagination.

```jsx
import { DataTable, Badge } from '@/components/admin';

const columns = [
  {
    key: 'id',
    label: 'Mã BN',
    sortable: true,
    className: 'font-medium text-[var(--color-admin-text-light-primary)]'
  },
  {
    key: 'name',
    label: 'Họ tên',
    sortable: true
  },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (value) => {
      const variants = {
        'Hoàn thành': 'success',
        'Đang xử lý': 'warning',
        'Đã hủy': 'danger'
      };
      return <Badge variant={variants[value]}>{value}</Badge>;
    }
  }
];

const data = [
  { id: 'BN001', name: 'Nguyễn Văn A', status: 'Hoàn thành' },
  { id: 'BN002', name: 'Trần Thị B', status: 'Đang xử lý' }
];

<DataTable
  title="Danh sách bệnh nhân"
  columns={columns}
  data={data}
  itemsPerPage={10}
  actions={(row) => (
    <button onClick={() => handleEdit(row)}>
      <span className="material-symbols-outlined">edit</span>
    </button>
  )}
/>
```

**Props:**
- `title`: (string, optional) Tiêu đề bảng
- `columns`: (array) Mảng các cột
  - `key`: (string) Key trong data object
  - `label`: (string) Tên hiển thị
  - `sortable`: (boolean) Có thể sort hay không
  - `className`: (string, optional) Custom class
  - `render`: (function, optional) Custom render function
- `data`: (array) Mảng dữ liệu
- `itemsPerPage`: (number, default: 10) Số items mỗi trang
- `actions`: (function, optional) Render action buttons

**Features:**
- Sorting theo cột
- Pagination tự động
- Responsive với horizontal scroll
- Custom render cho mỗi cell

---

### 3. ActivityFeed
Hiển thị danh sách các hoạt động gần đây.

```jsx
import { ActivityFeed } from '@/components/admin';

const activities = [
  {
    type: 'signup',
    message: '<strong>Nguyễn Văn A</strong> đã đăng ký tài khoản.',
    time: '5 phút trước'
  },
  {
    type: 'appointment',
    message: 'Lịch hẹn mới <strong>#LH123</strong> được tạo.',
    time: '12 phút trước'
  },
  {
    type: 'warning',
    message: 'Thuốc <strong>Paracetamol</strong> sắp hết hàng.',
    time: '1 giờ trước'
  }
];

<ActivityFeed
  title="Hoạt động gần đây"
  activities={activities}
/>
```

**Props:**
- `title`: (string, default: "Hoạt động gần đây") Tiêu đề
- `activities`: (array) Mảng các hoạt động
  - `type`: (string) Loại hoạt động (signup, order, warning, cancel, success, info, medical, appointment, payment)
  - `message`: (string) Nội dung (hỗ trợ HTML)
  - `time`: (string) Thời gian

**Activity Types:**
- `signup`: Đăng ký mới (màu primary)
- `order/success`: Đơn hàng/thành công (màu xanh)
- `warning`: Cảnh báo (màu vàng)
- `cancel/danger`: Hủy/lỗi (màu đỏ)
- `info`: Thông tin (màu xanh dương)
- `medical`: Y tế (màu teal)
- `appointment`: Lịch hẹn (màu tím)
- `payment`: Thanh toán (màu xanh lá)

---

### 4. StatsCard
Card hiển thị thống kê.

```jsx
import { StatsCard } from '@/components/admin';

<StatsCard
  title="Tổng bệnh nhân"
  value="1,234"
  trend="+12% so với tháng trước"
  trendType="success"
/>
```

**Props:**
- `title`: (string) Tiêu đề
- `value`: (string/number) Giá trị chính
- `trend`: (string, optional) Xu hướng
- `trendType`: (string, default: 'success') Loại trend (success, warning, danger)

---

### 5. Badge
Component badge cho status và labels.

```jsx
import { Badge } from '@/components/admin';

<Badge variant="success">Hoàn thành</Badge>
<Badge variant="warning">Đang xử lý</Badge>
<Badge variant="danger">Đã hủy</Badge>
<Badge variant="primary" size="lg">Ưu tiên</Badge>
```

**Props:**
- `children`: (ReactNode) Nội dung
- `variant`: (string, default: 'default') Màu sắc (success, warning, danger, primary, info, default)
- `size`: (string, default: 'md') Kích thước (sm, md, lg)

---

## Responsive Design

Tất cả components đều responsive:

- **Desktop (≥1024px)**: Hiển thị đầy đủ sidebar và tất cả features
- **Tablet (768px - 1023px)**: Mobile sidebar với overlay
- **Mobile (<768px)**: Compact layout, horizontal scroll cho tables

## Ví dụ sử dụng đầy đủ

```jsx
import {
  AdminLayout,
  StatsCard,
  DataTable,
  ActivityFeed,
  Badge
} from '@/components/admin';

const MyAdminPage = () => {
  const [context, setContext] = useState('Dashboard');

  return (
    <AdminLayout context={context} setContext={setContext}>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard
          title="Tổng bệnh nhân"
          value="1,234"
          trend="+12% so với tháng trước"
          trendType="success"
        />
        {/* More cards... */}
      </div>

      {/* Charts and Activity */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Chart or other content */}
        </div>
        <ActivityFeed activities={activities} />
      </div>

      {/* Data Table */}
      <div className="mt-8">
        <DataTable
          title="Danh sách gần đây"
          columns={columns}
          data={data}
        />
      </div>
    </AdminLayout>
  );
};
```

## Color Variables

Components sử dụng CSS variables từ `index.css`:

```css
--color-admin-primary: #4F46E5
--color-admin-success: #22C55E
--color-admin-warning: #F59E0B
--color-admin-danger: #EF4444
--color-admin-bg-light: #f6f7f8
--color-admin-foreground-light: #ffffff
--color-admin-text-light-primary: #1E293B
--color-admin-text-light-secondary: #64748B
--color-admin-border-light: #E2E8F0
```

## Icons

Sử dụng Material Symbols Outlined icons:
- Đã được import trong `index.html`
- Sử dụng class `material-symbols-outlined`

```jsx
<span className="material-symbols-outlined">dashboard</span>
```
