import * as journalService from './journal.service.js';
import { sendResponse } from '../../utils/response.js';

export const create = async (req, res, next) => {
  try {
    const journal = await journalService.createJournal(req.user.id, req.body);
    sendResponse(res, 201, true, journal);
  } catch (e) { next(e); }
};

export const getAll = async (req, res, next) => {
  try {
    const journals = await journalService.getJournals(req.user.id);
    sendResponse(res, 200, true, journals);
  } catch (e) { next(e); }
};

export const update = async (req, res, next) => {
  try {
    const journal = await journalService.updateJournal(req.user.id, req.params.id, req.body);
    sendResponse(res, 200, true, journal);
  } catch (e) { next(e); }
};

export const remove = async (req, res, next) => {
  try {
    await journalService.deleteJournal(req.user.id, req.params.id);
    sendResponse(res, 200, true, null, 'Journal deleted');
  } catch (e) { next(e); }
};