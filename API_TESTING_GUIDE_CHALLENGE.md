# Challenge System API Testing Guide

This guide provides instructions for testing the Challenge System API endpoints. Follow these steps to verify the functionality of the challenge features.

## Prerequisites

1. Ensure you have a running instance of the application
2. Have access to an API testing tool (e.g., Postman, cURL)
3. Valid user authentication tokens
4. Existing posts in the system

## Authentication

All challenge endpoints require authentication. Include the JWT token in the request header:

```
Authorization: Bearer <your_jwt_token>
```

## Test Scenarios

### 1. Create a Challenge

**Endpoint:** `POST /api/challenges`

**Request Body:**
```json
{
  "postId": "<valid_post_id>",
  "content": "This is a challenge description"
}
```

**Test Cases:**
- ✓ Successfully create a challenge with valid data
- ✗ Attempt to create without authentication
- ✗ Attempt to create with invalid postId
- ✗ Attempt to create with empty content

### 2. Get Challenges for a Post

**Endpoint:** `GET /api/challenges/post/:postId`

**Test Cases:**
- ✓ Retrieve all challenges for a valid post
- ✓ Verify correct challenge status display
- ✗ Attempt to retrieve with invalid postId
- ✗ Verify empty array for post with no challenges

### 3. Update Challenge Status

**Endpoint:** `PATCH /api/challenges/:challengeId/status`

**Request Body:**
```json
{
  "status": "completed" // or "rejected"
}
```

**Test Cases:**
- ✓ Successfully update challenge status to completed
- ✓ Successfully update challenge status to rejected
- ✗ Attempt to update with invalid status value
- ✗ Attempt to update without proper authorization

### 4. Get User's Challenges

**Endpoint:** `GET /api/challenges/user`

**Test Cases:**
- ✓ Retrieve all challenges created by authenticated user
- ✓ Verify challenge data structure
- ✗ Attempt to access without authentication

## Data Validation Tests

### Challenge Creation Validation
- Content length restrictions
- Valid post reference
- User authentication validation
- Duplicate challenge prevention

### Status Update Validation
- Valid status values
- Authorization checks
- State transition validation

## Expected Response Structure

### Single Challenge Response
```json
{
  "id": "<challenge_id>",
  "postId": "<post_id>",
  "userId": "<user_id>",
  "content": "Challenge description",
  "status": "active",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Error Response Structure
```json
{
  "message": "Error description",
  "error": "Optional detailed error information"
}
```

## Testing Tips

1. Always test with fresh authentication tokens
2. Verify response status codes match expectations
3. Check response data structure and types
4. Test rate limiting if implemented
5. Verify proper error handling
6. Test concurrent challenge creation

## Common HTTP Status Codes

- 200: Successful request
- 201: Successfully created
- 400: Bad request (invalid input)
- 401: Unauthorized
- 403: Forbidden
- 404: Resource not found
- 500: Server error

## Security Testing

1. Verify JWT token validation
2. Test CORS restrictions
3. Check authorization rules
4. Validate input sanitization
5. Test against SQL injection
6. Verify rate limiting

Remember to test both positive and negative scenarios for comprehensive coverage of the challenge system functionality.