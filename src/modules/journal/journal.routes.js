import { Router } from 'express';
import * as journalCtrl from './journal.controller.js';
import { protect } from '../../middlewares/auth.middleware.js';
import { journalSchema } from './journal.validation.js';

const router = Router();
router.use(protect); // All journal routes protected

router.get('/', journalCtrl.getAll);
router.get('/:id', journalCtrl.getById);
router.post('/', journalSchema, journalCtrl.create);
router.put('/:id', journalSchema, journalCtrl.update);
router.delete('/:id', journalCtrl.remove);

export default router;