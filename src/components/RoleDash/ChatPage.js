import React, { useEffect, useState } from 'react';
import { getMessages, sendMessage } from '../../api-helpers/api-helpers';
import { TextField, Button, Box, CircularProgress, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';

const ChatPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { state } = useLocation(); // Get sender name from state
  const senderName = state?.senderName || 'Unknown'; // Default to 'Unknown' if senderName is not provided
  const senderId = state?.senderId;
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (userId && senderId) {
      const fetchMessages = async () => {
        setIsLoading(true);
        try {
          const data = await getMessages(userId, senderId); // Fetch messages for the specific sender
          setMessages(data);
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
      const data = await getMessages(userId, senderId); // Fetch updated messages
      setMessages(data);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <h2>Chat with {senderName}</h2>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <Box>
          <Box sx={{ maxHeight: '400px', overflowY: 'auto', marginBottom: 2 }}>
            {messages.map((message) => (
              <Box
                key={message.id}
                sx={{
                  display: 'flex',
                  flexDirection: message.sender.id === userId ? 'row-reverse' : 'row',
                  marginBottom: 2,
                }}
              >
                <Box
                  sx={{
                    backgroundColor: message.sender.id === userId ? '#dcf8c6' : '#fff',
                    color: message.sender.id === userId ? 'black' : 'gray',
                    borderRadius: 2,
                    padding: '10px 15px',
                    maxWidth: '70%',
                    wordWrap: 'break-word',
                  }}
                >
                  <Typography>{message.content}</Typography>
                </Box>
              </Box>
            ))}
          </Box>

          <TextField
            label="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            fullWidth
            margin="normal"
            multiline
            rows={4}
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
