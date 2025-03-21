const { prisma } = require('@/config/dbConnect');
// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the category already exists
    const existingCategory = await prisma.category.findUnique({
      where: {
        name: name,
      },
    });

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists." });
    }

    // Create the new category
    const newCategory = await prisma.category.create({
      data: {
        name: name,
      },
    });

    return res.status(201).json({ message: "Category created successfully.", newCategory });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    // Check if the category exists
    const category = await prisma.category.findUnique({
      where: {
        id: parseInt(categoryId),
      },
    });

    if (!category) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Delete the category
    await prisma.category.delete({
      where: {
        id: parseInt(categoryId),
      },
    });

    return res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  createCategory,
  deleteCategory,
};
