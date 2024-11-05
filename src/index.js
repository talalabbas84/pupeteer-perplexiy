const express = require('express');
const perplexityRoutes = require('./api/routes/perplexityRoute');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;
app.use(cors());


app.use(express.json());
app.use('/api/perplexity', perplexityRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
