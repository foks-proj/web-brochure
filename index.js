const express = require('express')
const path = require('path');
const handlebars = require('handlebars');
const hbCreate = require('express-handlebars').create;

const app = express()
const port = 3002

const topPublic = "public";
const publicDirs = [
  topPublic,
  "node_modules/bootstrap/dist/",
  "dist"
];

function absDir(s) { return path.join(__dirname, s); }

const hbs = hbCreate({
  partialsDir : [
    absDir('views/partials')
  ],
  helpers : {
    cb: function(options) {
      return new handlebars.SafeString('<span class="text-info">' + options.fn(this) + '</span>');
    }
  } 
})

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './views');


app.get('/', (req, res) => {
  res.render('home')
})

app.use(
  publicDirs.map(dir => express.static(absDir(dir)))
);

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
