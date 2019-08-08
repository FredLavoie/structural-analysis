var express = require('express');
var app = express();
const PORT = 8080; // default port 8080



app.listen(PORT, () => {
	console.log(`structural_analysis_program app listening on port ${PORT}!`);
});


app.get("/", (req, res) => {
  res.send("Hello!");
});

