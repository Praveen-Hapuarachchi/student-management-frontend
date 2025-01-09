import React, { useEffect, useState } from 'react';
import { getMessages } from '../../api-helpers/api-helpers';
import { Box, List, ListItem, CircularProgress, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
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

  // Handle clicking on a sender's name to open the chat page
  const handleSenderClick = (senderId, senderName) => {
    navigate(`/chat/${senderId}`, { state: { senderId, senderName } }); // Pass senderId and senderName as state
  };

  // Get unique senders
  const uniqueSenders = Array.from(
    messages.reduce((map, message) => {
      if (!map.has(message.sender.id)) {
        map.set(message.sender.id, message.sender);
      }
      return map;
    }, new Map()).values()
  );

  return (
    <Box sx={{ padding: 3, maxWidth: 600, margin: '0 auto' }}>
      <Typography variant="h4" gutterBottom>
        Messages
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <List sx={{ paddingBottom: '20px' }}>
          {uniqueSenders.map((sender) => (
            <ListItem key={sender.id} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  maxWidth: '70%',
                  padding: 1,
                  marginBottom: 2,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 'bold', cursor: 'pointer' }}
                  onClick={() => handleSenderClick(sender.id, sender.fullName)} // Pass senderId and senderName
                >
                  {sender.fullName}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};

export default MessagesPage;