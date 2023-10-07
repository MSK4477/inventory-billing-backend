import { createProduct, getProducts } from "../controllers/productController.js";
import { Router } from "express";
import protect from "../middleware/authMiddleware.js"
const router = Router();

router.post("/",protect, createProduct);
router.get("/",protect, getProducts);
export default router;
