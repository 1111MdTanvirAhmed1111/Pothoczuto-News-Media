const { prisma } = require('@/config/dbConnect');
const { SendToGemini } = require('@/utils/Gemini');

// Get user notifications with pagination
exports.getUserNotifications = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Get notifications for the authenticated user
    const notifications = await prisma.notification.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePic: true
          }
        }
      }
    });

    // Get total count for pagination
    const totalCount = await prisma.notification.count({
      where: { userId: req.user.id }
    });

    // Update last notification viewed timestamp
    await prisma.user.update({
      where: { id: req.user.id },
      data: { lastNotificationViewedAt: new Date() }
    });

    res.status(200).json({
      notifications,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get summary of unread notifications using Gemini AI
exports.getNotificationSummary = async (req, res) => {
  try {
    // Get user's last notification check time
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { lastNotificationViewedAt: true }
    });

    // Get unread notifications
    const unreadNotifications = await prisma.notification.findMany({
      where: {
        userId: req.user.id,
        createdAt: {
          gt: user.lastNotificationViewedAt || new Date(0)
        }
      },
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            username: true
          }
        }
      }
    });

    if (unreadNotifications.length === 0) {
      return res.status(200).json({
        summary: "You have no new notifications."
      });
    }

    // Format notifications for Gemini
    const notificationText = unreadNotifications
      .map(notification => {
        const date = notification.createdAt.toLocaleDateString();
        return `[${date}] ${notification.content}`;
      })
      .join('\n');

    // Get summary from Gemini
    const prompt = `Please provide a concise summary of these notifications:\n${notificationText}`;
    const summary = await SendToGemini(prompt);

    res.status(200).json({
      summary: summary.candidates[0].content.parts[0].text,
      unreadCount: unreadNotifications.length
    });

  } catch (err) {
    console.error('Notification summary error:', err);
    res.status(500).json({ message: 'Failed to generate notification summary' });
  }
};