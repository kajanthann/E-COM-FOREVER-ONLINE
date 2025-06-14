import express from 'express'
import {addProduct,listProduct,removeProduct,signleProduct} from '../controllers/productController.js'
import upload from '../middleware/multer.js';
import authAdmin from '../middleware/adminAuth.js';

const productRouter = express.Router();

productRouter.post('/add',authAdmin,upload.fields([{name:'image1',maxCount:1},{name:'image2',maxCount:1},{name:'image3',maxCount:1},{name:'image4',maxCount:1}]),addProduct);
productRouter.post('/remove',authAdmin,removeProduct);
productRouter.post('/single',signleProduct);
productRouter.get('/list',listProduct);

export default productRouter;