import { Router } from "express";
import * as loginProcessor from "../controller/processors/loginProcessor";
import { authenticateToken } from '../middleware/authMiddleware';

const loginRoutes = Router();
loginRoutes.post('/login', loginProcessor.verifyLogin);
loginRoutes.post('/token', loginProcessor.verifyToken);
loginRoutes.post('/register', loginProcessor.registerAccount);
loginRoutes.post('/logout', loginProcessor.logoutUser);
loginRoutes.delete('/delete/:id', authenticateToken, loginProcessor.deleteAccount);
loginRoutes.get('/understudy/:id', authenticateToken, loginProcessor.getUnderstudies);

export default loginRoutes;
