const service = require("../services/categoriesIncome.service.js")

exports.createCategory = async (req, res) => {
  try {
    const { name, userId } = req.body
    if (!name || !userId)
      return res.status(400).json({ error: "Missing name or userId" })

    const data = await service.createCategory(name, userId)
    res.status(201).json({ message: "Category created", data })
  } catch (err) {
    console.error("Create category error:", err)
    res.status(500).json({ error: err.message })
  }
}
