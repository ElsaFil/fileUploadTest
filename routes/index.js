/* We'll centralize our routes imports to this file to keep our code clean */

const router = require("express").Router();
const uploadRoutes = require("./upload");

router.get("/", (req, res) => {
  res.send("This is home");
});

router.use("/api", uploadRoutes);

module.exports = router;
