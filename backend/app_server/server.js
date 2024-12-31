const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/config');

const articlesRoutes = require('./routes/articlesRoutes');
const userLocationRoutes = require('./routes/userLocationRoutes');
const userArticleClickRoutes = require('./routes/userArticleClickRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const sourcesRoutes = require('./routes/sourcesRoutes');

const app = express();
const PORT = process.env.PORT || 80;

// Configure CORS dynamically
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? ['https://almostallthe.news', 'https://www.almostallthe.news']
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/user-role', userRoleRoutes);
app.use('/articles', articlesRoutes);
app.use('/user-location', userLocationRoutes);
app.use('/user-article-click', userArticleClickRoutes);
app.use('/sources', sourcesRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
