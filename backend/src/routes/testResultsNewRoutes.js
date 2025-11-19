import express from 'express';
import { getAllTestResults, getTestResultById, getTestResultByCode, createTestResult, updateTestResult, deleteTestResult, searchTestResults, getTestResultsByStatus, getTestResultsByPatient, getTestResultsByDoctor } from '../controllers/testResultsController.js';

const router = express.Router();

router.get('/', getAllTestResults);
router.get('/search', searchTestResults);
router.get('/code/:code', getTestResultByCode);
router.get('/status/:status', getTestResultsByStatus);
router.get('/patient/:patientId', getTestResultsByPatient);
router.get('/doctor/:doctorName', getTestResultsByDoctor);
router.get('/:id', getTestResultById);
router.post('/', createTestResult);
router.put('/:id', updateTestResult);
router.delete('/:id', deleteTestResult);

export default router;
