/********************************** REQUIRED PACKAGES / PORT *****************************************/
/*****************************************************************************************************/
const express     = require('express');
const bodyParser  = require('body-parser');
const app         = express();
const PORT        = process.env.PORT || 8080; // default port 8080
const fs          = require('fs');

/************************************* SET / USE / LISTEN *********************************************/
/*****************************************************************************************************/

app.set('view engine', 'ejs');
app.set('views','./public/views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.static('program'));

app.listen(PORT, () => {
	console.log(`structural_analysis app listening on port ${PORT}!`);
});

/**************************************** GET REQUEST ************************************************/
/*****************************************************************************************************/

app.get('/', (req, res) => {
  console.log('rendering index.ejs');
  res.render('index');
});




/*************************************** POST REQUEST ************************************************/
/*****************************************************************************************************/

app.post('/submit', (req, res) => {
  console.log('this is req.body: ', req.body);
  
  fs.writeFile('program/data_in.txt', 'utf-8', function(error, data) {
    if (error) {
      console.log(error);
    }
  });
      
  res.render('results');
  
});
