const { prisma } = require('@/config/dbConnect');

/**
 * Creates an activity log entry for admin actions
 * @param {string} adminId - ID of the admin performing the action
 * @param {string} actionType - Type of action performed (e.g., 'approve_comment', 'delete_post')
 * @param {string} targetId - ID of the target resource (e.g., comment ID, post ID)
 * @param {string} details - Additional details about the action
 * @returns {Promise<Object>} Created activity log entry
 */
const createActivityLog = async (adminId, actionType, targetId, details) => {
  try {
    const activityLog = await prisma.activityLog.create({
      data: {
        adminId,
        actionType,
        targetId,
        details
      }
    });
    return activityLog;
  } catch (error) {
    console.error('Activity logging failed:', error);
    // Don't throw error to prevent disrupting main operation
    return null;
  }
};

module.exports = { createActivityLog };