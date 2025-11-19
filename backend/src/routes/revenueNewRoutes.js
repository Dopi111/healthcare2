import express from 'express';
import { getAllRevenue, getRevenueByMonth, createRevenue, updateRevenue, deleteRevenue, getRevenueStatistics, getMonthlyComparison } from '../controllers/revenueController.js';

const router = express.Router();

router.get('/', getAllRevenue);
router.get('/statistics', getRevenueStatistics);
router.get('/monthly-comparison', getMonthlyComparison);
router.get('/month/:month', getRevenueByMonth);
router.get('/:id', getAllRevenue);
router.post('/', createRevenue);
router.put('/:id', updateRevenue);
router.delete('/:id', deleteRevenue);

export default router;
