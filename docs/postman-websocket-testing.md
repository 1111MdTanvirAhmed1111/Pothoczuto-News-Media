# WebSocket Chat Testing Guide with Postman

## Prerequisites
- Ensure your server is running locally
- Install Postman desktop application (WebSocket testing is not available in web version)

## Setting Up WebSocket Connection

1. Open Postman and create a new request
2. Change the request type to "WebSocket Request"
3. Enter your WebSocket URL: `ws://localhost:YOUR_PORT`
4. Click "Connect" to establish WebSocket connection

## Testing User Join Event

1. After connection is established, go to the "Messages" tab
2. Click "New Message"
3. Set message type as "join"
4. Enter message in JSON format:
   ```json
   "user123"
   ```
5. Click "Send" to emit join event
6. Check server console for confirmation message

## Testing Message Exchange

1. Create a new message
2. Set message type as "sendMessage"
3. Enter message payload in JSON format:
   ```json
   {
     "from": "user123",
     "to": "user456",
     "content": "Hello, this is a test message!"
   }
   ```
4. Click "Send"

## Listening for Received Messages

1. In the "Messages" tab, click "Add a new listener"
2. Enter event name: "receivedMessage"
3. Messages received on this event will appear in the Messages panel

## Expected Behavior

- After sending a message, both sender and receiver should receive a "receivedMessage" event
- The received message will include:
  - from: sender's ID
  - to: receiver's ID
  - content: message content
  - timestamp: message timestamp

## Testing Multiple Users

1. Open another Postman tab
2. Create a new WebSocket connection
3. Join with a different user ID
4. Exchange messages between the two connections

## Troubleshooting

- Ensure server is running and WebSocket port is correct
- Check server console for connection and message logs
- Verify user IDs exist in your database
- Monitor network tab for connection issues

## Notes

- Messages are stored in the database through Prisma
- New chats are created automatically for first-time conversations
- Existing chats are reused for repeat conversations
- Disconnection is handled automatically by the server