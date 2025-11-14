import express, { Router } from 'express';
import { getUserById } from '../controllers/employeeControllers';
import { getListUser, loginUser, registerUser, updateUser } from '../controllers/usersController';

const router_users = express.Router();


//----- CRUD -----//
router_users.get("/list-user", getListUser);
router_users.post("/auth/users/register", registerUser);
router_users.post("/auth/users/login", loginUser);
router_users.get('/users/get-id/:user_id', getUserById);
router_users.put("/users/update/:user_id", updateUser);
// router_users.put("/delete/:user_id");
export default router_users;