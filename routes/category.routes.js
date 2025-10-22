const router = require("express").Router();
const {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controller/category.controller");
const authMiddleware = require("../middleware/auth.middleware");
const adminCheck = require("../middleware/admin.middleware");
const { categoryValidator } = require("../validators/category.validator");
const validate = require("../utils/validate");
const upload = require("../middleware/upload.middleware");

router.get("/", getAllCategories);
router.post("/", authMiddleware, adminCheck, upload.single("image"), categoryValidator, validate, createCategory);
router.put("/:id", authMiddleware, adminCheck, upload.single("image"), categoryValidator, validate, updateCategory);
router.delete("/:id", authMiddleware, adminCheck, deleteCategory);

module.exports = router;
