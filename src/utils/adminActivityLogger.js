const { createActivityLog } = require('./activityLogger');

/**
 * Logs admin activities with standardized parameters
 * @param {Object} params - Parameters for activity logging
 * @param {string} params.adminId - ID of the admin performing the action
 * @param {string} params.actionType - Type of action (e.g., 'APPROVE_COMMENT', 'DELETE_POST')
 * @param {string} params.targetId - ID of the affected resource
 * @param {string} params.details - Additional context about the action
 * @param {Object} [params.metadata] - Optional metadata about the action
 * @returns {Promise<Object|null>} The created activity log entry or null if logging fails
 */
const logAdminActivity = async ({ adminId, actionType, targetId, details, metadata = {} }) => {
  try {
    // Validate required parameters
    if (!adminId || !actionType || !targetId || !details) {
      console.error('Missing required parameters for activity logging');
      return null;
    }

    // Format details with metadata if provided
    const formattedDetails = metadata ? 
      `${details} | Metadata: ${JSON.stringify(metadata)}` : 
      details;

    // Create activity log entry
    const activityLog = await createActivityLog(
      adminId,
      actionType.toUpperCase(), // Standardize action types to uppercase
      targetId,
      formattedDetails
    );

    return activityLog;
  } catch (error) {
    console.error('Admin activity logging failed:', error);
    return null;
  }
};

// Export constants for standardized action types
const AdminActionTypes = {
  APPROVE_COMMENT: 'APPROVE_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
  DELETE_POST: 'DELETE_POST',
  UPDATE_POST: 'UPDATE_POST',
  BAN_USER: 'BAN_USER',
  UNBAN_USER: 'UNBAN_USER'
};

module.exports = { 
  logAdminActivity,
  AdminActionTypes
};