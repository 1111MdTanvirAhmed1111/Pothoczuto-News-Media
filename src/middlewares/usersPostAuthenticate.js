const { PrismaClient } = require('@prisma/client'); // Import Prisma Client
const prisma = new PrismaClient(); // Initialize Prisma Client

const usersPostAuthenticate = async (req, res, next) => {
    try {
        const user = req.user; // The user object should be available in req.user if authenticated middleware populated it

        if (!user) {
            return res.status(401).send({ error: 'User not found.' });
        }

        const postId = req.params.postId; // Get postId from the route parameters

        // Fetch the post using Prisma
        const post = await prisma.post.findUnique({
            where: { id: Number(postId) }, // Find the post by its ID
            include: { comments: { include: { user: true } } }, // Include comments and the related user (the one who created the comment)
        });

        if (!post) {
            return res.status(404).send({ error: 'Post not found.' });
        }

        // Check if the user is the owner of the post based on the comments relation (if applicable)
        const isOwner = post.authorId = req.user.id

        // Alternatively, if your posts have a createdBy field that links to the user, use that for ownership check
        // if (post.createdBy !== user.id) {
        //    return res.status(403).send({ error: 'Access denied. You do not own this post.' });
        // }

        if (!isOwner) {
            return res.status(403).send({ error: 'Access denied. You do not own this post.' });
        }

        req.post = post; // Attach the post to the request object
        next(); // Call the next middleware

    } catch (error) {
        console.error(error);
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

module.exports = usersPostAuthenticate;
