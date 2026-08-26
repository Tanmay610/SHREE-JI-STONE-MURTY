// server.js
const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve static files (frontend)
app.use(express.static(path.join(__dirname)));

// Example API endpoint – returns a static product list
app.get('/api/products', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Ganesh Murti",
      image: "product_ganesh_1787762900664.jpg",
      price: "₹12,999"
    },
    {
      id: 2,
      name: "Radha‑Krishna Murti",
      image: "product_radha_krishna_1787762913821.jpg",
      price: "₹9,499"
    },
    {
      id: 3,
      name: "Pink Sandstone Temple",
      image: "product_temple_1787762926904.jpg",
      price: "₹22,750"
    }
  ]);
});

// Fallback for SPA routing (if needed later)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server listening at http://localhost:${PORT}`);
});
