/**
 * Patients Routes
 * Routes for patient management (replacing PatientService localStorage)
 */

import express from 'express';
import {
  getAllPatients,
  getPatientById,
  getPatientByCode,
  createPatient,
  updatePatient,
  deletePatient,
  searchPatients,
  getPatientsByStatus,
  getPatientsByDoctor
} from '../controllers/patientsController.js';

const router = express.Router();

// GET routes
router.get('/', getAllPatients);
router.get('/search', searchPatients);
router.get('/code/:code', getPatientByCode);
router.get('/status/:status', getPatientsByStatus);
router.get('/doctor/:doctorName', getPatientsByDoctor);
router.get('/:id', getPatientById);

// POST routes
router.post('/', createPatient);

// PUT routes
router.put('/:id', updatePatient);

// DELETE routes
router.delete('/:id', deletePatient);

export default router;
