// postController.js (Prisma version)
const fs = require('fs');
const path = require('path');
const { prisma } = require('@/config/dbConnect');
const { default: axios } = require('axios');
const { SendToGemini } = require('@/utils/Gemini');
const { logAdminActivity } = require('@/utils/Functionalities/adminActivityLogger');

// Get all posts or a specific post
async function GetPosts(req, res, next) {
  const { id, limit, page } = req.query;

  // Parse the limit and page query parameters
  const limitValue = parseInt(limit) || 10; // Default limit to 10 posts
  const pageValue = parseInt(page) || 1; // Default to page 1
  const skipValue = (pageValue - 1) * limitValue; // Skip the appropriate number of posts

  try {
    if (id) {
      // Fetch a single post by ID including all relations
      const post = await prisma.post.findUnique({
        where: { id },
        include: {
          author: true,       // Include the post's author details
          comments: {
            include: {
              user: true,      // Include the user who created the comment
              replies: {
                include: {
                  user: true,  // Include users who replied to the comment
                },
              },
            },
          },
          votes: {
            include: {
              user: true,      // Include users who voted
            },
          },
          loves: {
            include: {
              user: true,      // Include users who loved the post
            },
          },
          categories: true,    // Include associated categories
          challenges: {
            include: {
              user: true,      // Include users who created challenges
            },
          },
        },
      });

      if (post) {
        return res.status(200).json(post);
      } else {
        return res.status(404).json({ message: 'Post Not Found' });
      }
    } else {
      // Fetch multiple posts with pagination and include relations
      const posts = await prisma.post.findMany({
        skip: skipValue,
        take: limitValue,
        include: {
          author: true,
          comments: {
            include: {
              user: true,
              replies: {
                include: {
                  user: true,
                },
              },
            },
          },
          votes: {
            include: {
              user: true,
            },
          },
          loves: {
            include: {
              user: true,
            },
          },
          categories: true,
          challenges: {
            include: {
              user: true,
            },
          },
        },
      });

      return res.status(200).json(posts);
    }
  } catch (error) {
    console.error(error);
    next(error);
  }
}


// Create a new post
const createPost = async (req, res) => {
  try {
    if (!req.body.Pdata) {
      return res.status(400).json({ error: 'Please Provide Details' });
    }
    

    const { title, content, category } = JSON.parse(req.body.Pdata);
    const imageUrl = req.file ? `./uploads/blogs/images/${req.file.filename}` : null; // Prisma uses null, not "null"

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: req.user.id, // Use the authenticated user's ID
        category,
        imageUrl,
      },
    });


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
    return res.status(404).json({ error: 'Please Provide Details' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }, // Convert to Int
    });
    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { title, content, author, category } = JSON.parse(req.body.Pdata);

    // Handle image update
    let imageUrl = post.imageUrl; // Keep old image by default
    if (req.file) {
      // Delete old image if exists
      if (post.imageUrl) { // Prisma uses null, not "null"
        const oldImagePath = path.join(__dirname, '..', post.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      imageUrl = `./uploads/blogs/images/${req.file.filename}`;
    }

    // Update the post
    const updatedPost = await prisma.post.update({
      where: { id: parseInt(id) },
      data: {
        title,
        content,
        author,
        category,
        imageUrl,
      },
    });

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


    logAdminActivity(req.user.id, 'Deleted', 'Post', id)

    const post = await prisma.post.findUnique({
      where: { id: parseInt(id) }, // Convert to Int
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Delete the image file if exists
    if (post.imageUrl) { // Prisma uses null, not "null"
      const imagePath = path.join(__dirname, '..', post.imageUrl);
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
    await prisma.post.delete({
      where: { id: parseInt(id) },
    });

 

    res.status(200).json({ message: 'Post deleted successfully', post });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Failed to delete post' });
  }
}

async function blogSummerizerGemini(req, res) {
  try {
   const {id}  = req.params
   const post = await prisma.post.findFirst(
    {
      where: {
        id: id
      }
    }
   )  

const gemini = await SendToGemini(`Heyy!! summerize the blog in short and crisp. Here is the blog:${post.content}`)


res.status(200).json({ text: gemini.candidates[0].content.parts[0].text })

}catch(error) {
  console.log(error)
  res.status(500).json({error: error})
}
}

// Approve a post
async function approvePost(req, res) {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        status: 'APPROVED'
      },
    });

    // Log admin activity
    await logAdminActivity(req.user.id, 'APPROVE', 'Post', id);

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Approve post error:', error);
    res.status(500).json({ error: 'Failed to approve post' });
  }
}

// Disapprove a post
async function disapprovePost(req, res) {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const updatedPost = await prisma.post.update({
      where: { id },
      data: {
        status: 'UNAPPROVED'
      },
    });

    // Log admin activity
    await logAdminActivity(req.user.id, 'REJECT', 'Post', id);

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error('Disapprove post error:', error);
    res.status(500).json({ error: 'Failed to disapprove post' });
  }
}

module.exports = { GetPosts, createPost, updatePost, deletePost, blogSummerizerGemini, approvePost, disapprovePost };