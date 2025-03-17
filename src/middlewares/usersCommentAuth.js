const jwt = require('jsonwebtoken');
const User = require('@/models/User');
const Comment = require('@/models/Comment');

const usersCommentAuthenticate = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token });

        if (!user) {
            throw new Error();
        }

        const comment = await Comment.findById(req.params.commentId);
        if (!comment) {
            return res.status(404).send({ error: 'Comment not found' });
        }

        if (comment.userId.toString() !== user._id.toString()) {
            return res.status(403).send({ error: 'User not authorized to access this comment' });
        }

        req.user = user;
        req.comment = comment;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = usersCommentAuthenticate;