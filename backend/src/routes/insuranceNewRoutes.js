import express from 'express';
import { getAllInsurance, getInsuranceById, createInsurance, updateInsurance, deleteInsurance, getInsuranceStatistics } from '../controllers/insuranceController.js';

const router = express.Router();

router.get('/', getAllInsurance);
router.get('/statistics', getInsuranceStatistics);
router.get('/:id', getInsuranceById);
router.post('/', createInsurance);
router.put('/:id', updateInsurance);
router.delete('/:id', deleteInsurance);

export default router;
