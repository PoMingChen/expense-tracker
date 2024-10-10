// Load the express module
const express = require('express');
const router = require('./routes') // 引用路由器
const port = 3000;
// Initialize the app
const app = express();

app.use(router) // 將 request 導入路由器(思考要放在 app.get('/' ,...) 之前還是之後？) 甚至之後 app.get('/'） 要直接 redirect 到 register ？

// Define a route for the root URL
app.get('/', (req, res) => {
  res.send('Hello World');
});

// Set the port to 3000


// Start the server and listen on port 3000
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
