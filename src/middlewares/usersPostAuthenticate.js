const jwt = require('jsonwebtoken');
const User = require('@/models/User');
const Post = require('@/models/Post'); // Import the Post model
 
const usersPostAuthenticate = async (req, res, next) => {
    try {
   

        const postId = req.params.postId; // Assuming the post ID is in the request parameters
        const post = await Post.findById(postId);

        if (!post || post.owner.toString() !== user._id.toString()) {
            return res.status(403).send({ error: 'Access denied. You do not own this post.' });
        }

        req.token = token;
        req.user = user;
        req.post = post; // Attach the post to the request object
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = usersPostAuthenticate;