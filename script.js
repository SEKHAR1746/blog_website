const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Create a post schema
const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  date: { type: Date, default: Date.now }
});

const Post = mongoose.model('Post', postSchema);

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve the HTML file
app.get('/', async (req, res) => {
  // Fetch all posts from the database
  const posts = await Post.find().sort({ date: 'desc' });
  res.send(posts);
});

// Handle new post submissions
app.post('/newpost', async (req, res) => {
  const { title, content } = req.body;

  // Create a new post
  const newPost = new Post({
    title,
    content
  });

  try {
    // Save the post to the database
    await newPost.save();
    res.send('Post created successfully!');
  } catch (error) {
    res.status(500).send('Error creating post.');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
