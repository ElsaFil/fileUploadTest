const express = require("express");
const router = express.Router();
const IncomingForm = require("formidable").IncomingForm;

// server.post('/upload', upload)
router.post("/upload", (req, res) => {
  // console.log(req.body);

  var form = new IncomingForm();

  //called for every file in the form
  form.on("file", (field, file) => {
    console.log(file);
    // Do something with the file
    // e.g. save it to the database
    // you can access it using file.path
  });

  // called when the form is completely parsed. We send back a success status code.
  form.on("end", () => {
    console.log("done");
    res.json();
  });

  // triggers the parsing of the form
  form.parse(req);

  // return res.status(400).json({ message: "Username is already taken" });
  // res.json(newUser);
});

module.exports = router;
