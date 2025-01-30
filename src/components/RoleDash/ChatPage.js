import React, { useEffect, useState } from 'react';
import { getMessagesBetweenUsers, sendMessage } from '../../api-helpers/api-helpers';
import { TextField, Button, Box, CircularProgress, Typography, Paper } from '@mui/material';
import { useParams, useLocation } from 'react-router-dom';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { senderId } = useParams(); // Get senderId from URL params
  const { state } = useLocation(); // Get senderName from state
  const senderName = state?.senderName || 'Unknown'; // Default to 'Unknown' if senderName is not provided
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName'); // Get the username from localStorage

  useEffect(() => {
    console.log('userId:', userId); // Debug log
    console.log('senderId:', senderId); // Debug log

    if (userId && senderId) {
      const fetchMessages = async () => {
        setIsLoading(true);
        try {
          // First API call: Get messages from sender to receiver (senderId -> userId)
          const senderMessages = await getMessagesBetweenUsers(senderId, userId);
          console.log('Sender to Receiver Messages:', senderMessages); // Debug log

          // Second API call: Get messages from receiver to sender (userId -> senderId)
          const receiverMessages = await getMessagesBetweenUsers(userId, senderId);
          console.log('Receiver to Sender Messages:', receiverMessages); // Debug log

          // Combine both message sets and sort them by timestamp
          const allMessages = [...senderMessages, ...receiverMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

          setMessages(allMessages); // Update state with combined messages
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessages();
    }
  }, [userId, senderId]);

  const handleSendMessage = async () => {
    if (!newMessage) return;

    setIsLoading(true);
    try {
      await sendMessage({
        senderId: userId,
        receiverId: senderId,
        content: newMessage,
      });
      setNewMessage('');

      // Add the new message to the state without refetching
      const newMessageObject = {
        id: Date.now(), // Temporary ID for the new message
        sender: { id: userId, fullName: userName },
        receiver: { id: senderId, fullName: senderName },
        content: newMessage,
        timestamp: new Date().toISOString(),
      };
      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Chat with {senderName}
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box>
          <Box sx={{ maxHeight: '400px', overflowY: 'auto', marginBottom: 2 }}>
            {messages.length === 0 ? (
              <Typography>No messages found</Typography>
            ) : (
              messages.map((message) => (
                <Box
                  key={`${message.id}-${message.timestamp}`} // Ensure unique keys
                  sx={{
                    display: 'flex',
                    justifyContent: message.sender.fullName === userName ? 'flex-end' : 'flex-start', // Align messages based on sender's name comparison
                    marginBottom: 2,
                  }}
                >
                  <Paper
                    elevation={3}
                    sx={{
                      backgroundColor: message.sender.fullName === userName ? '#dcf8c6' : '#f1f1f1',
                      color: 'black',
                      borderRadius: 2,
                      padding: '10px 15px',
                      maxWidth: '70%',
                      wordWrap: 'break-word',
                    }}
                  >
                    <Typography>{message.content}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: message.sender.fullName === userName ? 'right' : 'left' }}>
                      {message.sender.fullName === userName ? 'You' : message.sender.fullName} at {new Date(message.timestamp).toLocaleString()}
                    </Typography>
                  </Paper>
                </Box>
              ))
            )}
          </Box>

          <TextField
            label="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
            variant="outlined"
          />
          <Button
            variant="contained"
            onClick={handleSendMessage}
            sx={{ mt: 2 }}
            disabled={isLoading || !newMessage}
          >
            Send Message
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default ChatPage;
