const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// Serve all files from workspace root (so the provided HTML and assets are available)
app.use(express.static(path.join(__dirname)));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'price-comparison-app.html'));
});

app.listen(port, () => {
  console.log(`SmartShop demo running at http://localhost:${port}`);
});
