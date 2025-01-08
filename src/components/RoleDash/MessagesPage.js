import React, { useEffect, useState } from 'react';
import { getMessages, sendMessage } from '../../api-helpers/api-helpers';
import { TextField, Button, Box, List, ListItem,  CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate(); // For navigation when a name is clicked

  // Fetch messages from API
  useEffect(() => {
    if (userId) {
      const fetchMessages = async () => {
        setIsLoading(true);
        try {
          const data = await getMessages(userId);
          setMessages(data);
        } catch (error) {
          console.error('Error fetching messages:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessages();
    }
  }, [userId]);

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!newMessage || !receiverId) return;

    setIsLoading(true);
    try {
      await sendMessage({
        senderId: userId,
        receiverId,
        content: newMessage,
      });
      setNewMessage('');
      const data = await getMessages(userId);
      setMessages(data);
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle clicking on a sender's name to open the chat page
  const handleSenderClick = (senderId, senderName) => {
    navigate(`/chat/${senderId}`, { state: { senderId, senderName } }); // Pass senderId and senderName as state
  };

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <h2>Messages</h2>

      {isLoading ? (
        <CircularProgress />
      ) : (
        <List sx={{ paddingBottom: '20px' }}>
          {messages.map((message) => (
            <ListItem key={message.id} sx={{ display: 'flex', flexDirection: message.sender.id === userId ? 'row-reverse' : 'row' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.sender.id === userId ? 'flex-end' : 'flex-start',
                  maxWidth: '70%',
                  padding: 1,
                  marginBottom: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => handleSenderClick(message.sender.id, message.sender.fullName)} // Pass senderId and senderName
                >
                  {message.sender.fullName}
                </Typography>
                <Box
                  sx={{
                    backgroundColor: message.sender.id === userId ? '#dcf8c6' : '#fff',
                    color: message.sender.id === userId ? 'black' : 'gray',
                    borderRadius: 2,
                    padding: '10px 15px',
                    maxWidth: '80%',
                    wordWrap: 'break-word',
                  }}
                >
                  <Typography>{message.content}</Typography>
                </Box>
                <Typography variant="body2" sx={{ fontSize: '0.8rem', color: 'gray', marginTop: '5px' }}>
                  {new Date(message.timestamp).toLocaleString()}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}

      <TextField
        label="Receiver ID"
        value={receiverId}
        onChange={(e) => setReceiverId(e.target.value)}
        fullWidth
        margin="normal"
      />

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
        disabled={isLoading || !newMessage || !receiverId} // Disable while loading or missing inputs
      >
        Send Message
      </Button>
    </Box>
  );
};

export default MessagesPage;
