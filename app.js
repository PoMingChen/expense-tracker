// Load the express module
const express = require('express');
const flash = require('connect-flash')
const session = require('express-session')
const { engine } = require('express-handlebars')
const port = 3000;
// Initialize the app
const app = express();
const methodOverride = require('method-override')
const router = require('./routes')
const messageHandler = require('./middlewares/message-handler')
const errorHandler = require('./middlewares/error-handler')
const passport = require('./config/passport.js')

app.engine('.hbs',
  engine({
    extname: '.hbs',
    helpers: {
      // Helper for checking equality
      eq: (a, b) => a === b,

      // Helper for returning the correct icon based on categoryId
      getIcon: function (categoryId) {
        const CATEGORY_ICONS = {
          1: 'fa-home',
          2: 'fa-shuttle-van',
          3: 'fa-grin-beam',
          4: 'fa-utensils',
          5: 'fa-pen'
        };
        return CATEGORY_ICONS[categoryId];
      },

      formatDate: function (date) {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = d.getMonth() + 1; // Months are zero-based
        const day = d.getDate();
        return `${year}/${month}/${day}`;
      }
    }
  }));

app.set('view engine', '.hbs')
app.set('views', './views')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

if (process.env.NODE_ENV === 'development') {
  require('dotenv').config()
}

console.log('env', process.env.NODE_ENV)
console.log('env', process.env.SESSION_SECRET)

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler)


// Define a route for the root URL
// app.get('/', (req, res) => {
//   res.send('Hello World');
// });

app.use(messageHandler)
app.use(router) // 將 request 導入路由器(思考要放在 app.get('/' ,...) 之前還是之後？) 甚至之後 app.get('/'） 要直接 redirect 到 register ？
app.get('/', (req, res) => {
  res.redirect('/register')
})
app.use(errorHandler)

// Start the server and listen on port 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
