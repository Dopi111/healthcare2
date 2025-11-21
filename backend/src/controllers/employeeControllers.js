import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

/*--------- 
 REGISTER EMPLOYEE
---------*/
export const registerEmployee = async (req, res) => {
  const { employee_id, password, phone, card_id } = req.body;
  //Timeline: Chuyển qua bảng auth_employee
  try {
    if (!password || !phone || !card_id) {
      return res.status(400).json({ error: "⚠️ Vui lòng nhập đầy đủ thông tin!" });
    }

    const isNumeric = /^\d+$/; // chỉ chấp nhận ký tự số

    // Kiểm tra employee_id nếu có
    if (employee_id) {
      if (!isNumeric.test(employee_id) || employee_id.length !== 10) {
        return res.status(400).json({ error: "❌ Mã nhân viên phải gồm đúng 10 chữ số!" });
      }
    }

    // Kiểm tra phone & card_id
    if (!isNumeric.test(phone) || phone.length !== 10) {
      return res.status(400).json({ error: "❌ Số điện thoại phải gồm đúng 10 chữ số!" });
    }
    if (!isNumeric.test(card_id) || card_id.length !== 12) {
      return res.status(400).json({ error: "❌ Số thẻ (card_id) phải gồm đúng 12 chữ số!" });
    }

    // Kiểm tra trùng
    if ((employee_id && (employee_id === phone || employee_id === card_id)) || phone === card_id) {
      return res.status(400).json({
        error: "❌ Mã nhân viên, Số điện thoại và Căn cước công dân không được trùng nhau!"
      });
    }

    // Kiểm tra trùng trong DB
    const checkExistQuery = `
      SELECT * FROM users
      WHERE (employee_id IS NOT NULL AND employee_id = $1)
        OR phone_number = $2
        OR card_id = $3
    `;
    const existResult = await db.query(checkExistQuery, [
      employee_id || null, // quan trọng: undefined -> null
      phone,
      card_id
    ]);

    if (existResult.rowCount > 0) {
      return res.status(400).json({
        error: "⚠️ Mã nhân viên, Số điện thoại và Căn cước công dân không được trùng nhau!"
      });
    }

    // Băm password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Xác định role dựa vào employee_id
    const role = employee_id ? 'employee' : 'patient';

    // Thêm mới
    const insertAuthQuery = `
      INSERT INTO users (employee_id, password, phone_number, card_id, role)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const authResult = await db.query(insertAuthQuery, [
      employee_id || null,
      hashedPassword,
      phone,
      card_id,
      role
    ]);

    return res.status(201).json({
      message: "✅ Đăng ký thành công!",
      user: authResult.rows[0]
    });

  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ error: "❌ Đăng ký thất bại, lỗi hệ thống!" });
  }
};

/*---------
 LOGIN EMPLOYEE
---------*/
export const loginEmployee = async (req, res) => {
  const { employee_id, password } = req.body;

  try {
    // V2: Query from users table with role check
    const result = await db.query(
      `SELECT * FROM users
       WHERE employee_id = $1
       AND role IN ('employee', 'administrator', 'doctor', 'nurse', 'receptionist', 'accountant', 'technician')`,
      [employee_id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ success: false, message: "Không tìm thấy tài khoản" });
    }

    const user = result.rows[0];

    // So sánh password nhập vào với password đã hash trong DB
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Sai mật khẩu" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { user_id: user.user_id, employee_id: user.employee_id, role: user.role },
      process.env.JWT_SECRET || "SECRET_KEY",
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      message: "Đăng nhập thành công",
      token,
      user: {
        user_id: user.user_id,
        employee_id: user.employee_id,
        full_name: user.full_name,
        role: user.role,
        position: user.position
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Đăng nhập thất bại" });
  }
};

/*--------- 
 GET EMPLOYEE BY ID
---------*/
export const getEmployeeById = async (req, res) => {
  const { employee_id } = req.params; // <-- lấy employee_id từ URL (có thể là string như "admin2024")

  try {
    const q = `
      SELECT
        e.employee_id as infor_employee_id,
        u.employee_id,
        u.full_name,
        u.card_id,
        u.phone_number,
        u.date_of_birth,
        u.gender,
        u.permanent_address,
        u.current_address,
        p.position_name AS position,
        d.department_name AS department,
        e.business_description as business,
        e.start_date as started_date,
        e.salary,
        e.coefficient,
        e.attached_documents as attached,
        e.employment_status as status_employee
      FROM employees e
      JOIN users u ON e.user_id = u.user_id
      LEFT JOIN positions p ON e.position_id = p.position_id
      LEFT JOIN departments d ON e.department_id = d.department_id
      WHERE u.employee_id = $1
      LIMIT 1;
    `;

    const { rows, rowCount } = await db.query(q, [employee_id]);

    if (rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy nhân viên có ID này!"
      });
    }

    return res.status(200).json({
      ok: true,
      data: rows[0]
    });

  } catch (err) {
    console.error("❌ Lỗi khi lấy thông tin nhân viên:", err);
    return res.status(500).json({
      ok: false,
      error: "Lỗi máy chủ khi truy vấn thông tin nhân viên!"
    });
  }
};


/*--------- 
 GET USER BY ID
---------*/
export const getUserById = async (req, res) => {
  const { phone_number } = req.params; //Dùng số điện thoại để đăng nhập

  try {
    const q = `
      SELECT
        user_id,
        employee_id,
        phone_number,
        card_id,
        full_name,
        date_of_birth,
        gender,
        permanent_address,
        current_address,
        role
      FROM users
      WHERE phone_number = $1
        AND role = 'patient'
      LIMIT 1;
    `;

    const { rows, rowCount } = await db.query(q, [phone_number]);

    if (rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy khách hàng có số điện thoại này!"
      });
    }

    return res.status(200).json({
      ok: true,
      data: rows[0]
    });

  } catch (err) {
    console.error("Lấy thông tin khách hàng không thành công:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi kết nối server!"
    });
  }
};

/*--------- 
 UPDATE EMPLOYEE
---------*/
export const updateEmployee = async (req, res) => {
  const { employee_id } = req.params;
  const updates = req.body;

  try {
    const fields = Object.keys(updates);
    const values = Object.values(updates);

    if (fields.length === 0) {
      return res.status(400).json({ error: "⚠️ Không có dữ liệu để cập nhật!" });
    }

    // Tạo câu query động
    const setQuery = fields.map((field, i) => `${field} = $${i + 1}`).join(', ');
    const query = `UPDATE users SET ${setQuery} WHERE employee_id = $${fields.length + 1} RETURNING *`;

    const { rows } = await db.query(query, [...values, employee_id]);

    return res.status(200).json({
      message: "✅ Cập nhật thành công!",
      user: rows[0]
    });
  } catch (err) {
    console.error("Update employee error:", err);
    return res.status(500).json({ error: "❌ Cập nhật thất bại, lỗi server!" });
  }
};

/*---------
 GET LIST EMPLOYEE
---------*/
export const getListEmployee = async (req, res) => {
  try {
    const q = `
      SELECT
        user_id,
        full_name,
        employee_id,
        card_id,
        phone_number,
        email,
        date_of_birth,
        gender,
        position,
        department,
        specialty,
        permanent_address,
        current_address,
        role,
        created_at
      FROM users
      WHERE role IN ('employee', 'administrator', 'doctor', 'nurse', 'receptionist', 'accountant', 'technician')
      ORDER BY full_name ASC
    `;
    const { rows, rowCount } = await db.query(q);
    if (rowCount === 0) {
      return res.status(404).json({
        ok: false,
        message: "❌ Không tìm thấy nhân viên nào!"
      });
    }

    return res.status(200).json({
      ok: true,
      data: rows
    });

  } catch (err) {
    console.error("Lấy danh sách nhân viên không thành công:", err);
    return res.status(500).json({
      ok: false,
      error: "❌ Lỗi kết nối server!"
    });
  }
}

/*---------
 CREATE EMPLOYEE (Full data)
---------*/
export const createEmployeeFull = async (req, res) => {
  const {
    full_name,
    employee_id,
    phone_number,
    card_id,
    email,
    date_of_birth,
    gender,
    position,
    department,
    specialty,
    permanent_address,
    current_address,
    password
  } = req.body;

  try {
    // Validation
    if (!full_name || !employee_id || !phone_number || !card_id) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập đầy đủ thông tin bắt buộc!"
      });
    }

    const isNumeric = /^\d+$/;

    // Validate formats
    if (!isNumeric.test(employee_id) || employee_id.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Mã nhân viên phải gồm đúng 10 chữ số!"
      });
    }

    if (!isNumeric.test(phone_number) || phone_number.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại phải gồm đúng 10 chữ số!"
      });
    }

    if (!isNumeric.test(card_id) || card_id.length !== 12) {
      return res.status(400).json({
        success: false,
        message: "Số CCCD phải gồm đúng 12 chữ số!"
      });
    }

    // Check for duplicates
    const checkQuery = `
      SELECT * FROM users
      WHERE employee_id = $1 OR phone_number = $2 OR card_id = $3
    `;
    const checkResult = await db.query(checkQuery, [employee_id, phone_number, card_id]);

    if (checkResult.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Mã nhân viên, số điện thoại hoặc CCCD đã tồn tại!"
      });
    }

    // Hash password (default: employee_id if not provided)
    const hashedPassword = await bcrypt.hash(password || employee_id, 10);

    // Insert new employee into users
    const insertQuery = `
      INSERT INTO users
        (employee_id, phone_number, card_id, password, full_name, email,
         date_of_birth, gender, position, department, specialty,
         permanent_address, current_address, role)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'employee')
      RETURNING user_id, full_name, employee_id, phone_number, card_id,
                email, date_of_birth, gender, position, department, specialty,
                permanent_address, current_address, role, created_at
    `;

    const result = await db.query(insertQuery, [
      employee_id,
      phone_number,
      card_id,
      hashedPassword,
      full_name,
      email || null,
      date_of_birth || null,
      gender || 'Nam',
      position || null,
      department || null,
      specialty || null,
      permanent_address || null,
      current_address || null
    ]);

    const newUser = result.rows[0];

    // Get position_id and department_id from their names
    let position_id = null;
    let department_id = null;

    if (position) {
      const posResult = await db.query(
        'SELECT position_id FROM positions WHERE position_name = $1 LIMIT 1',
        [position]
      );
      if (posResult.rows.length > 0) {
        position_id = posResult.rows[0].position_id;
      }
    }

    if (department) {
      const deptResult = await db.query(
        'SELECT department_id FROM departments WHERE department_name = $1 LIMIT 1',
        [department]
      );
      if (deptResult.rows.length > 0) {
        department_id = deptResult.rows[0].department_id;
      }
    }

    // Create corresponding record in employees table
    const insertEmployeeQuery = `
      INSERT INTO employees
        (user_id, position_id, department_id, employment_status)
      VALUES ($1, $2, $3, 'active')
      RETURNING employee_id
    `;

    await db.query(insertEmployeeQuery, [
      newUser.user_id,
      position_id,
      department_id
    ]);

    return res.status(201).json({
      success: true,
      message: "Thêm nhân viên thành công!",
      data: newUser
    });

  } catch (err) {
    console.error("Create employee error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + err.message
    });
  }
};

/*---------
 UPDATE EMPLOYEE (Full data)
---------*/
export const updateEmployeeFull = async (req, res) => {
  const { employee_id } = req.params;
  const {
    full_name,
    phone_number,
    card_id,
    email,
    date_of_birth,
    gender,
    position,
    department,
    specialty,
    permanent_address,
    current_address
  } = req.body;

  try {
    // Check if employee exists
    const checkQuery = 'SELECT * FROM users WHERE employee_id = $1';
    const checkResult = await db.query(checkQuery, [employee_id]);

    if (checkResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên!"
      });
    }

    // Check for duplicates (excluding current employee)
    const duplicateQuery = `
      SELECT * FROM users
      WHERE employee_id != $1 AND (phone_number = $2 OR card_id = $3)
    `;
    const duplicateResult = await db.query(duplicateQuery, [employee_id, phone_number, card_id]);

    if (duplicateResult.rowCount > 0) {
      return res.status(400).json({
        success: false,
        message: "Số điện thoại hoặc CCCD đã tồn tại!"
      });
    }

    // Update employee
    const updateQuery = `
      UPDATE users
      SET full_name = $1,
          phone_number = $2,
          card_id = $3,
          email = $4,
          date_of_birth = $5,
          gender = $6,
          position = $7,
          department = $8,
          specialty = $9,
          permanent_address = $10,
          current_address = $11,
          updated_at = CURRENT_TIMESTAMP
      WHERE employee_id = $12
      RETURNING user_id, full_name, employee_id, phone_number, card_id,
                email, date_of_birth, gender, position, department, specialty,
                permanent_address, current_address, role, updated_at
    `;

    const result = await db.query(updateQuery, [
      full_name,
      phone_number,
      card_id,
      email || null,
      date_of_birth || null,
      gender,
      position || null,
      department || null,
      specialty || null,
      permanent_address || null,
      current_address || null,
      employee_id
    ]);

    return res.status(200).json({
      success: true,
      message: "Cập nhật nhân viên thành công!",
      data: result.rows[0]
    });

  } catch (err) {
    console.error("Update employee error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + err.message
    });
  }
};

/*---------
 DELETE EMPLOYEE
---------*/
export const deleteEmployee = async (req, res) => {
  const { employee_id } = req.params;

  try {
    const deleteQuery = `
      DELETE FROM users
      WHERE employee_id = $1 AND role IN ('employee', 'administrator', 'doctor', 'nurse', 'receptionist', 'accountant', 'technician')
      RETURNING full_name, employee_id
    `;

    const result = await db.query(deleteQuery, [employee_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy nhân viên hoặc không thể xóa!"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Đã xóa nhân viên ${result.rows[0].full_name} thành công!`
    });

  } catch (err) {
    console.error("Delete employee error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + err.message
    });
  }
};

/*---------
 DELETE USER
---------*/
export const deleteUser = async (req, res) => {
  const { user_id } = req.params;

  try {
    const deleteQuery = `
      DELETE FROM users
      WHERE user_id = $1 AND role = 'patient'
      RETURNING full_name, user_id
    `;

    const result = await db.query(deleteQuery, [user_id]);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng hoặc không thể xóa!"
      });
    }

    return res.status(200).json({
      success: true,
      message: `Đã xóa người dùng ${result.rows[0].full_name} thành công!`
    });

  } catch (err) {
    console.error("Delete user error:", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi server: " + err.message
    });
  }
};
