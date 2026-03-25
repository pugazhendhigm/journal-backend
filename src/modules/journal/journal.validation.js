import { body, validationResult } from 'express-validator';

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });
  next();
};

export const journalSchema = [
  body('content').notEmpty().trim().withMessage('Journal content cannot be empty'),
  body('mood').optional().isString(),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  validate
];