import React, { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const Accounts_Management = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('customers') // 'customers' | 'employees'

  const [search, setSearch] = useState('')
  const [filterSpecialty, setFilterSpecialty] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get('http://localhost:5001/api/employee')
        const data = res.data?.data || res.data || []
        setItems(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])
  // Hàm format ID thành chuỗi 10 số
  const formatId = (id) => {
    if (!id && id !== 0) return '-'
    return id.toString().padStart(10, '0')
  }

  // danh sách chuyên khoa cho filter nhân viên
  const specialties = useMemo(() => {
    const s = new Set()
    items.forEach((it) => {
      if (it.specialty) s.add(it.specialty)
      if (it.Specialty) s.add(it.Specialty)
    })
    return Array.from(s).filter(Boolean)
  }, [items])

  // lọc dữ liệu theo tab
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    let list = []

    if (activeTab === 'customers') {
      list = items.filter(it => (it.role_user || it.role) === 'users')
    } else {
      list = items.filter(it => (it.role_user || it.role) === 'employees')
    }

    if (filterSpecialty && activeTab === 'employees') {
      list = list.filter(it => {
        const spec = (it.specialty || it.Specialty || '').toLowerCase()
        return spec.includes(filterSpecialty.toLowerCase())
      })
    }

    if (q) {
      list = list.filter(it => {
        const full = `${it.full_name || it.fullName || ''}`.toLowerCase()
        const card = `${it.card_id || it.cardId || it.cccd || ''}`.toLowerCase()
        const emp = `${it.employee_id || it.employeeId || ''}`.toLowerCase()
        const phone = `${it.phone_number || it.phone || ''}`.toLowerCase()
        return full.includes(q) || card.includes(q) || emp.includes(q) || phone.includes(q)
      })
    }

    return list
  }, [items, search, filterSpecialty, activeTab])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý Tài khoản</h2>

      {/* Tabs */}
      <div className="flex gap-3 mb-4 border-b">
        <button
          onClick={() => setActiveTab('customers')}
          className={`pb-2 ${activeTab === 'customers' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
        >
          Tài khoản Khách hàng
        </button>
        <button
          onClick={() => setActiveTab('employees')}
          className={`pb-2 ${activeTab === 'employees' ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
        >
          Tài khoản Nhân viên
        </button>
      </div>

      {/* Bộ lọc */}
      <div className="flex gap-3 mb-4 items-center">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={activeTab === 'customers' ? 'Tìm theo họ tên, SDT, mã KH...' : 'Tìm theo họ tên, mã NV, chuyên khoa...'}
          className="border rounded px-3 py-2 w-80"
        />

        {activeTab === 'employees' && (
          <select
            value={filterSpecialty}
            onChange={(e) => setFilterSpecialty(e.target.value)}
            className="border rounded px-2 py-2"
          >
            <option value="">Tất cả chuyên khoa</option>
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        <div className="ml-auto text-sm text-gray-600">Tổng: {filtered.length}</div>
      </div>

      {/* Bảng dữ liệu */}
      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            {activeTab === 'customers' ? (
              <tr className="text-left bg-gray-50">
                <th className="px-4 py-2">Mã KH</th>
                <th className="px-4 py-2">Họ và Tên</th>
                <th className="px-4 py-2">Số điện thoại</th>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2">Hành động</th>
              </tr>
            ) : (
              <tr className="text-left bg-gray-50">
                <th className="px-4 py-2">Mã TK NV</th>
                <th className="px-4 py-2">Mã NV</th>
                <th className="px-4 py-2">Họ và Tên</th>
                <th className="px-4 py-2">Phòng ban</th>
                <th className="px-4 py-2">Vị trí</th>
                <th className="px-4 py-2">Ngày tạo</th>
                <th className="px-4 py-2">Trạng thái</th>
              </tr>
            )}
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={9} className="p-6 text-center">Đang tải...</td>
              </tr>
            )}

            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="p-6 text-center text-gray-500">Không có dữ liệu</td>
              </tr>
            )}

            {!loading && filtered.map((row, idx) => (
              activeTab === 'customers' ? (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{row.user_id || row.customer_id || '-'}</td>
                  <td className="px-4 py-2">{row.full_name || row.fullName || '-'}</td>
                  <td className="px-4 py-2">{row.phone_number || row.phone || '-'}</td>
                  <td className="px-4 py-2">{row.created_at || row.createdAt || '-'}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Xem</button>
                      <button className="px-2 py-1 bg-yellow-400 text-black rounded text-sm">Sửa</button>
                    </div>
                  </td>
                </tr>
              ) : (
                <tr key={idx} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{formatId(row.account_id || row.accountId || '-')}</td>
                  <td className="px-4 py-2">{row.employee_id || row.employeeId || '-'}</td>
                  <td className="px-4 py-2">{row.full_name || row.fullName || '-'}</td>
                  <td className="px-4 py-2">{row.department || row.dept || '-'}</td>
                  <td className="px-4 py-2">{row.position || '-'}</td>
                  <td className="px-4 py-2">{row.created_at || row.createdAt || '-'}</td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <button className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Xem</button>
                      <button className="px-2 py-1 bg-yellow-400 text-black rounded text-sm">Sửa</button>
                    </div>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="mt-3 text-red-600">{error}</p>}
    </div>
  )
}

export default Accounts_Management
