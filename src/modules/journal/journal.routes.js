import { Router } from 'express';
import * as journalCtrl from './journal.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { journalSchema } from './journal.validation.js';

const router = Router();
router.use(protect); // All journal routes protected

router.post('/', journalSchema, journalCtrl.create);
router.put('/:id', journalSchema, journalCtrl.update);

export default router;