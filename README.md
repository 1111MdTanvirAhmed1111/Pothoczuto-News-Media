# 📰 Pothoczuto News Media API Documentation 🌐

> 🚀 Welcome to the Pothoczuto News Media API - Your Gateway to Dynamic Content Management! ⚡

This comprehensive documentation 📚 provides detailed insights about our powerful API endpoints 🔌, robust authentication system 🔐, and practical usage examples 💡 to help you integrate and leverage our platform effectively.

## 📑 Table of Contents
- [Authentication](#-authentication) 🔐
- [Blog Posts](#-blog-posts) 📝
- [Comments](#-comments) 💬
- [Follow System](#-follow-system) 👥
- [Categories](#-categories) 📁
- [Voting](#-voting) 👍
- [Activity Logging](#-activity-logging) 📊
- [Challenge System](#-challenge-system) 🏆
- [Chat System](#-chat-system) 💭

## 🔐 Authentication

### Register a New User
**Endpoint:** `POST /api/auth/register`

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### Login
**Endpoint:** `POST /api/auth/login`

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

### Get User Data
**Endpoint:** `GET /api/auth/userdata`

### Forgot Password
**Endpoint:** `POST /api/auth/forgot-password`

**Request Body:**
```json
{
  "email": "string"
}
```

**Description:** Generates and sends OTP to the user's email for password reset.

### Verify OTP
**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "email": "string",
  "otp": "string"
}
```

**Description:** Validates the OTP and returns a reset token.

### Reset Password
**Endpoint:** `POST /api/auth/reset-password`

**Request Body:**
```json
{
  "token": "string",
  "newPassword": "string"
}
```

**Description:** Resets the user's password using the valid reset token.

## 📝 Blog Posts

### Get All Posts
**Endpoint:** `GET /api/posts`

**Description:** Retrieves all blog posts. This endpoint is publicly accessible.

### Create a New Post
**Endpoint:** `POST /api/posts`

**Authentication:** Required (Writer role)

**Request Body:** Form Data
- `PostImg`: File (Image)
- `title`: string
- `content`: string
- `categoryId`: string

### Update a Post
**Endpoint:** `PUT /api/posts/:id`

**Authentication:** Required (Writer or Admin role)

**Parameters:**
- `id`: Post ID

**Request Body:** Form Data
- `title`: string (optional)
- `content`: string (optional)
- `PostImg`: File (Image, optional)
- `categoryId`: string (optional)

### Delete a Post
**Endpoint:** `DELETE /api/posts/:id`

**Authentication:** Required (Writer or Admin role)

**Parameters:**
- `id`: Post ID

## 💬 Comments

### Get All Comments for a Blog Post
**Endpoint:** `GET /api/comments/:blogId`

**Parameters:**
- `blogId`: Blog post ID

### Add a Comment
**Endpoint:** `POST /api/comments/:blogId`

**Authentication:** Required

**Parameters:**
- `blogId`: Blog post ID

**Request Body:**
```json
{
  "content": "string"
}
```

### Reply to a Comment
**Endpoint:** `POST /api/comments/reply/:commentId`

**Authentication:** Required

**Parameters:**
- `commentId`: Comment ID

**Request Body:**
```json
{
  "content": "string"
}
```

### Edit a Comment
**Endpoint:** `PUT /api/comments/:id`

**Authentication:** Required (Comment owner)

**Parameters:**
- `id`: Comment ID

**Request Body:**
```json
{
  "content": "string"
}
```

### Delete a Comment
**Endpoint:** `DELETE /api/comments/:id`

**Authentication:** Required (Comment owner or Admin)

**Parameters:**
- `id`: Comment ID

### Approve a Comment
**Endpoint:** `PUT /api/comments/:id/approve`

**Authentication:** Required (Admin role)

**Parameters:**
- `id`: Comment ID

## 🔔 Notifications

### Get User Notifications
**Endpoint:** `GET /api/notifications`

**Authentication:** Required

**Query Parameters:**
```json
{
  "page": "number (optional, default: 1)",
  "limit": "number (optional, default: 10)"
}
```

**Description:** Retrieves paginated notifications for the authenticated user and updates the last notification viewed timestamp.

### Get Notification Summary
**Endpoint:** `GET /api/notifications/summary`

**Authentication:** Required

**Description:** Provides an AI-powered summary of unread notifications using Gemini AI.

## 🤖 AI Features

### Blog Summarization
**Endpoint:** `GET /api/posts/summarize/:id`

**Authentication:** Required

**Parameters:**
- `id`: Blog post ID

**Description:** Generates a concise summary of the blog post using Gemini AI.

## 💭 Chat System

### Get Chat History
**Endpoint:** `POST /api/chat/get-chatting`

**Authentication:** Required

**Request Body:**
```json
{
  "from": "number (user ID)",
  "to": "number (recipient ID)"
}
```

**Description:** Retrieves chat history between two users.

### Get Chat List
**Endpoint:** `POST /api/chat/chat-list`

**Authentication:** Required

**Request Body:**
```json
{
  "from": "number (user ID)"
}
```

**Description:** Retrieves all chat conversations for a user.

## 📊 Activity Logging

### Get Admin Activity Logs
**Endpoint:** `GET /api/activity-logs`

**Authentication:** Required (Admin role)

**Description:** Retrieves logs of administrative actions performed on the platform.

## 👥 Follow System

### Follow a User
**Endpoint:** `POST /api/follow/:followingId`

**Authentication:** Required

**Parameters:**
- `followingId`: ID of the user to follow

### Unfollow a User
**Endpoint:** `POST /api/follow/unfollow`

**Authentication:** Required

**Request Body:**
```json
{
  "followerId": "number",
  "followingId": "number"
}
```

### Get User's Followers
**Endpoint:** `GET /api/follow/followers/:userId`

**Parameters:**
- `userId`: User ID

### Get User's Following
**Endpoint:** `GET /api/follow/following/:userId`

**Parameters:**
- `userId`: User ID

## 👍 Voting System

### Vote on a Post
**Endpoint:** `POST /api/votes/vote`

**Authentication:** Required

**Request Body:**
```json
{
  "postId": "number",
  "voteType": "string (upvote/downvote)"
}
```

## 🏆 Challenge System

### Create a Challenge
**Endpoint:** `POST /api/challenges`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "startDate": "date",
  "endDate": "date",
  "reward": "string"
}
```

### Get All Challenges
**Endpoint:** `GET /api/challenges`

### Get Challenge by ID
**Endpoint:** `GET /api/challenges/:id`

**Parameters:**
- `id`: Challenge ID

### Submit Challenge Entry
**Endpoint:** `POST /api/challenges/:id/submit`

**Authentication:** Required

**Parameters:**
- `id`: Challenge ID

**Request Body:**
```json
{
  "content": "string",
  "attachments": "array (optional)"
}
```

## 👥 Follow System

### Follow a User
**Endpoint:** `POST /api/follow/follow`

**Authentication:** Required

**Request Body:**
```json
{
  "followerId": "string",
  "followingId": "string"
}
```

### Unfollow a User
**Endpoint:** `POST /api/follow/unfollow`

**Authentication:** Required

**Request Body:**
```json
{
  "followerId": "string",
  "followingId": "string"
}
```

### Get User Followers
**Endpoint:** `GET /api/follow/followers/:userId`

**Parameters:**
- `userId`: User ID

### Get User Following
**Endpoint:** `GET /api/follow/following/:userId`

**Parameters:**
- `userId`: User ID

## 📁 Categories

### Create Category
**Endpoint:** `POST /api/category/:id`

**Authentication:** Required (Admin role)

**Request Body:**
```json
{
  "name": "string"
}
```

### Delete Category
**Endpoint:** `DELETE /api/category/:id`

**Authentication:** Required (Admin role)

**Parameters:**
- `id`: Category ID

## 👍 Voting

### Upvote a Post
**Endpoint:** `POST /api/vote/upvote`

**Authentication:** Required

**Request Body:**
```json
{
  "postId": "string"
}
```

### Downvote a Post
**Endpoint:** `POST /api/vote/downvote`

**Authentication:** Required

**Request Body:**
```json
{
  "postId": "string"
}
```

### Get Post Votes
**Endpoint:** `GET /api/vote/votes/:postId`

**Parameters:**
- `postId`: Post ID

## 📊 Activity Logging

### Get Activity Logs
**Endpoint:** `GET /api/activity-logs`

**Authentication:** Required (Admin role)

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `actionType`: Filter by action type (e.g., 'APPROVE_COMMENT', 'DELETE_POST')
- `targetType`: Filter by target type (e.g., 'user', 'post', 'comment')

**Response:**
```json
{
  "success": true,
  "data": {
    "activityLogs": [
      {
        "id": "string",
        "adminId": "string",
        "actionType": "string",
        "targetId": "string",
        "targetType": "string",
        "details": "object",
        "metadata": "object",
        "createdAt": "string",
        "admin": {
          "id": "string",
          "username": "string",
          "email": "string",
          "role": "string"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "itemsPerPage": 10,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

**Available Action Types:**
- `APPROVE_COMMENT`: Admin approves a comment
- `DELETE_COMMENT`: Admin deletes a comment
- `DELETE_POST`: Admin deletes a post
- `UPDATE_POST`: Admin updates a post
- `BAN_USER`: Admin bans a user
- `UNBAN_USER`: Admin unbans a user

## 🏆 Challenge System

### Create a Challenge
**Endpoint:** `POST /api/challenges/post/:id`

**Authentication:** Required

**Parameters:**
- `id`: Post ID

**Request Body:**
```json
{
  "content": "string"
}
```

**Description:** Creates a new challenge for a specific blog post.

### Get Post Challenges
**Endpoint:** `GET /api/challenges/post/:id`

**Parameters:**
- `id`: Post ID

**Description:** Retrieves all challenges for a specific blog post.

### Update Challenge Status
**Endpoint:** `PATCH /api/challenges/:id`

**Authentication:** Required

**Parameters:**
- `id`: Challenge ID

**Request Body:**
```json
{
  "status": "string" // "pending", "accepted", or "rejected"
}
```

**Description:** Updates the status of a challenge. Only the post owner can update the challenge status.

### Delete Challenge
**Endpoint:** `DELETE /api/challenges/:id`

**Authentication:** Required

**Parameters:**
- `id`: Challenge ID

**Description:** Deletes a challenge. Only the challenge creator or post owner can delete the challenge.

## 💭 Chat System

### Get Chat Messages
**Endpoint:** `GET /api/chat`

**Authentication:** Required

**Request Body:**
```json
{
  "from": "string",
  "to": "string"
}
```

### Get Chat List
**Endpoint:** `GET /api/chat`

**Authentication:** Required

**Request Body:**
```json
{
  "from": "string"
}
```

### Send Message
**Endpoint:** `POST /api/chat/sendMessage`

**Authentication:** Required

**Request Body:**
```json
{
  "from": "string",
  "to": "string",
  "message": "string"
}
```

## 🔒 Authentication and Authorization

Many endpoints require authentication and specific roles. Here's how to authenticate:

1. Register a new account or login to get your authentication token
2. Include the token in your request headers:
   ```
   Authorization: Bearer your-token-here
   ```

### Roles
- **Writer** ✍️: Can create, edit, and delete their own posts
- **Admin** 👑: Has full access to manage all posts and comments
- **User** 👤: Can comment and manage their own comments

## ⚠️ Error Handling

The API uses standard HTTP status codes:

- 200: Success ✅
- 201: Created 🆕
- 400: Bad Request ❌
- 401: Unauthorized 🚫
- 403: Forbidden 🔒
- 404: Not Found 🔍
- 500: Internal Server Error 💥

Error responses include a message describing the error:
```json
{
  "error": "Error message description"
}
```

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your environment variables
4. Start the server:
   ```bash
   npm start
   ```

## 💡 Example Usage

### Creating a New Post (using Postman)

1. Set the request method to `POST` and URL to `http://your-api/api/posts`
2. In the Headers tab, add:
   ```
   Authorization: Bearer your-token
   ```
3. In the Body tab:
   - Select "form-data"
   - Add the following key-value pairs:
     - Key: `PostImg` (Type: File) - Select your image file
     - Key: `title` - Value: "My Blog Post"
     - Key: `content` - Value: "This is my blog post content"
     - Key: `categoryId` - Value: "your-category-id"

### Following a User (using Postman)

1. Set the request method to `POST` and URL to `http://your-api/api/follow/follow`
2. In the Headers tab, add:
   ```
   Authorization: Bearer your-token
   Content-Type: application/json
   ```
3. In the Body tab:
   - Select "raw" and choose "JSON"
   - Add the following JSON:
   ```json
   {
     "followerId": "user1-id",
     "followingId": "user2-id"
   }
   ```
```
