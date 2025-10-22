const Category = require("../schema/category.schema");
const CustomErrorHandler = require("../utils/custom.error.handler");


///// ADD
exports.createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    const exist = await Category.findOne({ name });
    if (exist) return next(CustomErrorHandler.badRequest("Category already exists"));

    const image = req.file ? req.file.filename : null;
    const category = await Category.create({ name, image });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};


///// GET_ALL
exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};


/////  DELETE
exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return next(CustomErrorHandler.notFound("Category not found"));
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (err) {
    next(err);
  }
};


///// UPDATE
exports.updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const update = { };
    if (name) update.name = name;
    if (req.file) update.image = req.file.filename;
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!category) return next(CustomErrorHandler.notFound("Category not found"));
    res.json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};
