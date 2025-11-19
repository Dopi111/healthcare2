import express from 'express';
import { getAllFunds, getFundById, createFund, updateFund, deleteFund, getFundStatistics } from '../controllers/fundsController.js';

const router = express.Router();

router.get('/', getAllFunds);
router.get('/statistics', getFundStatistics);
router.get('/:id', getFundById);
router.post('/', createFund);
router.put('/:id', updateFund);
router.delete('/:id', deleteFund);

export default router;
