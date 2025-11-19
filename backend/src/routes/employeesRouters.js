import express, { Router } from 'express'
import {
  getEmployeeById,
  getListEmployee,
  loginEmployee,
  registerEmployee,
  updateEmployee,
  createEmployeeFull,
  updateEmployeeFull,
  deleteEmployee,
  deleteUser
} from '../controllers/employeeControllers.js'

const router = express.Router();


//----- CRUD -----//
// List and get employees
router.get("/list-employee", getListEmployee);
router.get('/:employee_id', getEmployeeById); // <-- Lấy theo employee_id

// Auth
router.post("/register", registerEmployee);
router.post("/login", loginEmployee);

// Full CRUD operations
router.post("/create", createEmployeeFull); // Create employee with full data
router.put("/update/:employee_id", updateEmployee); // Legacy update
router.put("/update-full/:employee_id", updateEmployeeFull); // Update with full data
router.delete("/delete/:employee_id", deleteEmployee); // Delete employee
router.delete("/delete-user/:user_id", deleteUser); // Delete user

export default router;