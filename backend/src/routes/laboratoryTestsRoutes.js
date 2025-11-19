import express from 'express';
import { getAllLabTests, getLabTestById, getLabTestByCode, createLabTest, updateLabTest, deleteLabTest, getLabTestStatistics, searchLabTests, getLabTestsByStatus } from '../controllers/laboratoryTestsController.js';

const router = express.Router();

router.get('/', getAllLabTests);
router.get('/search', searchLabTests);
router.get('/statistics', getLabTestStatistics);
router.get('/code/:code', getLabTestByCode);
router.get('/status/:status', getLabTestsByStatus);
router.get('/:id', getLabTestById);
router.post('/', createLabTest);
router.put('/:id', updateLabTest);
router.delete('/:id', deleteLabTest);

export default router;
