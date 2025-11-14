import express, { Router } from 'express'
import { getEmployeeById, getListEmployee, loginEmployee, registerEmployee, updateEmployee } from '../controllers/employeeControllers.js'

const router = express.Router();


//----- CRUD -----//
// Login
router.get("/list-employee", getListEmployee);
router.post("/register", registerEmployee);
router.get('/:employee_id', getEmployeeById); // <-- Lấy theo employee_id
router.post("/login", loginEmployee);
router.put("/update/:employee_id", updateEmployee);
export default router;