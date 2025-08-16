import express from 'express';
import { addFood, getFood, removeFood, updateStatus } from '../controllers/AdminControllers.js';
import upload from '../configs/multer.js';

const router = express.Router();

router.get('/getFoods',getFood)
router.post('/addFood', upload.single("image"),addFood);
router.post('/removeFood',removeFood)
router.post('/updateStatus',updateStatus)
export default router;
