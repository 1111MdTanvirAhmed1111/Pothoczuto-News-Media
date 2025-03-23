# Pothoczuto News Media API Documentation

This documentation provides details about the available endpoints, authentication requirements, and usage examples for the Pothoczuto News Media API.

## Table of Contents
- [Authentication](#authentication)
- [Blog Posts](#blog-posts)
- [Comments](#comments)
- [Follow System](#follow-system)
- [Categories](#categories)
- [Voting](#voting)
- [Chat System](#chat-system)

## Authentication

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

## Blog Posts

### Get All Posts
**Endpoint:** `GET /api/posts`

**Description:** Retrieves all blog posts. This endpoint is publicly accessible.

### Create a New Post
**Endpoint:** `POST /api/posts`

**Authentication:** Required (Writer role)

**Request Body:** Form Data
- `PostImg`: File (Image)
- Other post details

### Update a Post
**Endpoint:** `PUT /api/posts/:id`

**Authentication:** Required (Writer or Admin role)

**Parameters:**
- `id`: Post ID

### Delete a Post
**Endpoint:** `DELETE /api/posts/:id`

**Authentication:** Required (Writer or Admin role)

**Parameters:**
- `id`: Post ID

## Comments

### Get All Comments for a Blog Post
**Endpoint:** `GET /api/comments/:blogId`

**Parameters:**
- `blogId`: Blog post ID

### Add a Comment
**Endpoint:** `POST /api/comments/:blogId`

**Authentication:** Required

**Parameters:**
- `blogId`: Blog post ID

### Reply to a Comment
**Endpoint:** `POST /api/comments/reply/:commentId`

**Authentication:** Required

**Parameters:**
- `commentId`: Comment ID

### Edit a Comment
**Endpoint:** `PUT /api/comments/:id`

**Authentication:** Required (Comment owner)

**Parameters:**
- `id`: Comment ID

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

## Follow System

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

## Categories

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

## Voting

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

## Chat System

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

## Authentication and Authorization

Many endpoints require authentication and specific roles. Here's how to authenticate:

1. Register a new account or login to get your authentication token
2. Include the token in your request headers:
   ```
   Authorization: Bearer your-token-here
   ```

### Roles
- **Writer**: Can create, edit, and delete their own posts
- **Admin**: Has full access to manage all posts and comments
- **User**: Can comment and manage their own comments

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

Error responses include a message describing the error:
```json
{
  "error": "Error message description"
}
```

## Getting Started

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

## Example Usage

### Creating a New Post (using cURL)
```bash
curl -X POST http://your-api/api/posts \
  -H "Authorization: Bearer your-token" \
  -F "PostImg=@/path/to/image.jpg" \
  -F "title=My Blog Post" \
  -F "content=This is my blog post content"
```

### Following a User (using JavaScript fetch)
```javascript
const response = await fetch('http://your-api/api/follow/follow', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your-token',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    followerId: 'user1-id',
    followingId: 'user2-id'
  })
});
```