const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from environment variables or default to 5000

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/news-app';
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

// Define the schema and model
const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
  image: { type: String, required: true },
});

const News = mongoose.model('News', newsSchema);

// Endpoint to add news articles to the database
app.post('/news', async (req, res) => {
  try {
    const { title, description, url, image } = req.body;

    // Create a new news article
    const newArticle = new News({ title, description, url, image });

    // Save the article to the database
    await newArticle.save();

    res.status(201).json({ message: 'News article added successfully', article: newArticle });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add news article', details: error.message });
  }
});

// Endpoint to retrieve all news articles from the database
app.get('/news', async (req, res) => {
  try {
    const articles = await News.find();
    res.json(articles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch news articles', details: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
