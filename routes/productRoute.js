import { createProduct, getProducts, getProduct, updateProduct, deleteProduct } from "../controllers/productController.js";
import { Router } from "express";
import protect from "../middleware/authMiddleware.js"
const router = Router();

router.post("/",protect, createProduct);
router.get("/",protect, getProducts);
router.get("/:id",protect, getProduct);
router.post("/update/:id",protect, updateProduct);
router.get("/delete/:id",protect, deleteProduct);
export default router;
