
const {app} = require('@/Server/ServerStart');

const authRoutes = require('@/routes/authRoutes');
const blogRoutes = require('@/routes/blogRoutes');
const commentRoutes = require('@/routes/commentRoutes');
const categoryRoutes = require('@/routes/categoryRoutes');
const challengeRoutes = require('@/routes/challengeRoutes');
const chattingRoutes = require('@/routes/chattingRoutes');
const followRoutes = require('@/routes/followRoutes');
const voteRoutes = require('@/routes/voteRoutes');
const passwordResetRoutes = require('@/routes/passwordResetRoutes');
const activityRoutes = require('@/routes/activityLogRoutes');
const PostLoveRoutes = require('@/routes/postLoveRoutes');

const useRoutes = () => {

    // Server Welcomer
    app.get('/', (req, res) => {
        res.send('Welcome to the News Media API!');  
    })

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/posts', blogRoutes);
    app.use('/api/comments', commentRoutes);
    app.use('/api/categories', categoryRoutes);
    app.use('/api/challenges', challengeRoutes);
    app.use('/api/chat', chattingRoutes);
    app.use('/api/follow', followRoutes);
    app.use('/api/vote', voteRoutes);
    app.use('/api/auth' , passwordResetRoutes);
    app.use('/api/activity', activityRoutes);
    app.use('/api/postLove', PostLoveRoutes);

}

module.exports = {useRoutes};