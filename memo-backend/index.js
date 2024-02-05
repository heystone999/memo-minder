// index.js
const app = require('./src/app');  // 引入 Express 应用

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
