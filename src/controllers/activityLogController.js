const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getActivityLogs = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Build filter conditions
        const where = {};
        if (req.query.actionType) {
            where.actionType = req.query.actionType;
        }
        if (req.query.targetType) {
            where.targetType = req.query.targetType;
        }

        // Fetch activity logs with pagination
        const [activityLogs, total] = await Promise.all([
            prisma.activityLog.findMany({
                skip,
                take: limit,
                where,
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    admin: {
                        select: {
                            id: true,
                            username: true,
                            email: true,
                            role: true
                        }
                    }
                }
            }),
            prisma.activityLog.count({ where })
        ]);

        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;

        res.json({
            success: true,
            data: {
                activityLogs,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalItems: total,
                    itemsPerPage: limit,
                    hasNextPage,
                    hasPrevPage
                }
            }
        });
    } catch (error) {
        console.error('Error fetching activity logs:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity logs',
            error: error.message
        });
    }
};

module.exports = {
    getActivityLogs
};