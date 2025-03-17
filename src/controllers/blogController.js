const fs = require('fs');
const path = require('path');

// Assuming you have a Post model like this:
const Post = require('@/models/Post') // Path to your Post model

// Get all posts or a specific post
async function GetPosts(req, res,next) {
  const { id } = req.query;
  const { limit, page } = req.query;

  // Parse the limit and page query parameters
  const limitValue = parseInt(limit) || 10;  // Default limit to 10 posts
  const pageValue = parseInt(page) || 1;     // Default to page 1
  const skipValue = (pageValue - 1) * limitValue;  // Skip the appropriate number of posts

  try {
    if (id) {
      // If an ID is provided, try to find the post by ID
      const post = await Post.findById(id);
      if (post) {
        return res.status(200).json(post);
      } else {
        return res.status(404).json({ "title": "Post Not Found" });
      }
    } else {
      // If no ID, apply pagination logic
      const posts = await Post.find({}).skip(skipValue).limit(limitValue);
      return res.status(200).json(posts);
    }

  } catch (error) {
    req.error = error
    next(error)
  }
}

// Create a new post
const createPost = async (req, res) => {
  try {
    if (!req.body.Pdata) {
      return res.status(400).json({ "error": "Please Provide Details" });
    }

    const { title, content, author, category } = JSON.parse(req.body.Pdata);
    const imageUrl = req.file ? `./uploads/blogs/images/${req.file.filename}` : "null";

    const post = await Post.create({
      title,
      content,
      author,
      category,
      imageUrl
    });

    // Emit new post event to all connected clients
    const io = req.app.get('io');
    io.emit('new_post', post);

    res.status(200).json(post);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to create post', message: error.message });
  }
};


// Update a post
async function updatePost(req, res) {
  const { id } = req.params;

  if (!req.body.Pdata) {
    return res.status(404).json({ "error": "Please Provide Details" });
  }

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ "error": "Post not found" });
    }

    const { title, content, author, category } = JSON.parse(req.body.Pdata);

    // Handle image update
    let imageUrl = post.imageUrl; // Keep old image by default
    if (req.file) {
      // Delete old image if exists
      if (post.imageUrl && post.imageUrl !== "null") {
        const oldImagePath = path.join(__dirname, '..', post.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `./uploads/blogs/images/${req.file.filename}`;
    }

    

    // Using findByIdAndUpdate() instead of save()
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      {
        title,
        content,
        author,
        category,
        imageUrl
      },
      { new: true } // Returns the updated document
    );

    // Emit update event to clients in this post's room
    const io = req.app.get('io');
    io.to(`post_${id}`).emit('post_updated', updatedPost);

    res.status(200).json(updatedPost);
  } catch (error) {
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ error: 'Failed to update post' });
  }
}

// Delete a post
async function deletePost(req, res) {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ "error": "Post not found" });
    }

    // Delete the image file if exists
    if (post.imageUrl && post.imageUrl !== "null") {
      const imagePath = path.join(__dirname, '..', post.imageUrl.replace('.', ''));
      console.log('Attempting to delete image at:', imagePath);
      
      try {
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
          console.log('Image deleted successfully');
        }
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Delete the post from database
    await Post.findByIdAndDelete(id);

    // Emit delete event to all clients
    const io = req.app.get('io');
    io.emit('post_deleted', id);

    res.status(200).json({ message: "Post deleted successfully", post });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
}

module.exports = { GetPosts, createPost, updatePost, deletePost };
