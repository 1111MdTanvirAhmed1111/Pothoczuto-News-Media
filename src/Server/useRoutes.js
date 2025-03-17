
const {app} = require('@/Server/ServerStart');

const authRoutes = require('@/routes/authRoutes');
const blogRoutes = require('@/routes/blogRoutes');
const commentRoutes = require('@/routes/commentRoutes')
const useRoutes = () => {

    
    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/posts', blogRoutes);
    app.use('/api/comments', commentRoutes);

}

module.exports = {useRoutes};