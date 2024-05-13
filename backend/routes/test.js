const express = require("express");
const router = express.Router();

router.get("/test", async (req, res) => {
  try {
    return res.status(200).json({ success: true, data: "success" });
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error occurred" });
  }
});

module.exports = router;
