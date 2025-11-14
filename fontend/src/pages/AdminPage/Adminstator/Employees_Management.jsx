import { useEffect, useMemo, useState } from 'react'
import axios from 'axios'

const Employees_Management = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [filterDepartment, setFilterDepartment] = useState('')
  const [filterPosition, setFilterPosition] = useState('')

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await axios.get('http://localhost:5001/api/employee/list-employee')
        const data = res.data?.data || res.data || []
        const employees = Array.isArray(data) ? data.filter(r => (r.role_user || r.role || '').toLowerCase() !== 'users') : []
        setItems(employees)
      } catch (err) {
        setError(err.response?.data?.error || err.message || 'Failed to load')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const departments = useMemo(() => Array.from(new Set(items.map(i => i.department).filter(Boolean))), [items])
  const positions = useMemo(() => Array.from(new Set(items.map(i => i.position).filter(Boolean))), [items])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return items.filter((it) => {
      if (filterDepartment && it.department !== filterDepartment) return false
      if (filterPosition && it.position !== filterPosition) return false
      if (!q) return true
      const full = `${it.full_name || it.fullName || ''}`.toLowerCase()
      const card = `${it.card_id || it.cardId || it.cccd || ''}`.toLowerCase()
      const spec = `${it.specialty || it.Specialty || ''}`.toLowerCase()
      return full.includes(q) || card.includes(q) || spec.includes(q)
    })
  }, [items, search, filterDepartment, filterPosition])

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Quản lý Nhân viên</h2>

      <div className="flex gap-3 mb-4 items-center">
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo họ tên, CCCD, chuyên khoa..." className="border rounded px-3 py-2 w-80" />

        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)} className="border rounded px-2 py-2">
          <option value="">Tất cả phòng ban</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>

        <select value={filterPosition} onChange={(e) => setFilterPosition(e.target.value)} className="border rounded px-2 py-2">
          <option value="">Tất cả chức vụ</option>
          {positions.map(p => <option key={p} value={p}>{p}</option>)}
        </select>

        <div className="ml-auto text-sm text-gray-600">Tổng: {filtered.length}</div>
      </div>

      <div className="bg-white rounded shadow overflow-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-4 py-2">Họ và tên</th>
              <th className="px-4 py-2">Mã NV</th>
              <th className="px-4 py-2">SĐT</th>
              <th className="px-4 py-2">CCCD</th>
              <th className="px-4 py-2">Chức vụ</th>
              <th className="px-4 py-2">Chuyên khoa</th>
              <th className="px-4 py-2">Phòng ban</th>
              <th className="px-4 py-2">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="p-6 text-center">Đang tải...</td>
              </tr>
            )}
            {!loading && filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">Không có nhân viên</td>
              </tr>
            )}
            {!loading && filtered.map((row, idx) => (
              <tr key={idx} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{row.full_name || row.fullName || '-'}</td>
                <td className="px-4 py-2">{row.employee_id || row.employeeId || '-'}</td>
                <td className="px-4 py-2">{row.phone_number || row.phone || '-'}</td>
                <td className="px-4 py-2">{row.card_id || row.cardId || row.cccd || '-'}</td>
                <td className="px-4 py-2">{row.position || '-'}</td>
                <td className="px-4 py-2">{row.specialty || row.Specialty || '-'}</td>
                <td className="px-4 py-2">{row.department || '-'}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <button className="px-2 py-1 bg-blue-500 text-white rounded text-sm">Chi tiết</button>
                    <button className="px-2 py-1 bg-red-500 text-white rounded text-sm">Xóa</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && <p className="mt-3 text-red-600">{error}</p>}
    </div>
  )
}

export default Employees_Management