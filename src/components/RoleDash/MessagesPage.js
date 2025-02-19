import React, { useEffect, useState } from 'react';
import { getMessages, sendMessage, getAllUsers, getMessagesBetweenUsers } from '../../api-helpers/api-helpers';
import { Box, List, ListItem, CircularProgress, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HeaderForUser from './HeaderForUser';
import SendIcon from '@mui/icons-material/Send'; // Import SendIcon from Material-UI
import backgroundImage from '../../assets/Message_BG.png'; // Import the background image
import Footer from '../Footer';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const fetchMessagesAndUsers = async () => {
        setIsLoading(true);
        try {
          const [messagesData, usersData] = await Promise.all([getMessages(userId), getAllUsers()]);
          setMessages(messagesData);
          setUsers(usersData);

          // Fetch the last message for each contact
          const contacts = Array.from(
            [...messagesData].reduce((map, item) => {
              const contact = item.sender?.id === userId ? item.receiver : item.sender;
              if (!contact) return map;
              map.set(contact.id, contact);
              return map;
            }, new Map()).values()
          );

          const lastMessages = await Promise.all(
            contacts.map(async (contact) => {
              const conversation = await getMessagesBetweenUsers(userId, contact.id);
              return {
                ...contact,
                lastMessage: conversation.length > 0 ? conversation[conversation.length - 1].content : 'No messages yet',
                timestamp: conversation.length > 0 ? conversation[conversation.length - 1].timestamp : null,
              };
            })
          );

          setMessages((prevMessages) =>
            prevMessages.map((msg) => {
              const contact = lastMessages.find((lm) => lm.id === (msg.sender?.id === userId ? msg.receiver.id : msg.sender.id));
              return contact ? { ...msg, lastMessage: contact.lastMessage, timestamp: contact.timestamp } : msg;
            })
          );
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchMessagesAndUsers();
    }
  }, [userId]);

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
      const receiver = users.find((user) => user.id.toString() === receiverId.toString()) || {
        id: receiverId,
        fullName: 'Unknown User',
        role: 'Unknown',
      };

      const newMessageObject = {
        sender: { id: userId, fullName: 'You', role: 'ROLE_USER' },
        receiver,
        content: newMessage,
        createdAt: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessageObject]);
      navigate(`/chat/${receiverId}`, { state: { senderId: receiver.id, senderName: receiver.fullName } });
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const uniqueContacts = Array.from(
    [...messages].reduce((map, item) => {
      const contact = item.sender?.id === userId ? item.receiver : item.sender;
      if (!contact) return map;
  
      const existingContact = map.get(contact.id);
      
      if (!existingContact || new Date(item.timestamp) > new Date(existingContact.timestamp)) {
        map.set(contact.id, {
          id: contact.id,
          fullName: contact.fullName || 'Unknown User',
          role: contact.role || 'Unknown',
          lastMessage: item.lastMessage || 'No messages yet', // Use lastMessage instead of content
          timestamp: item.timestamp, // Store timestamp for comparison
        });
      }
      
      return map;
    }, new Map()).values()
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)); // Sort by latest message timestamp

  const getRoleColor = (role) => {
    switch (role) {
      case 'ROLE_STUDENT':
        return 'lightgreen';
      case 'ROLE_TEACHER':
        return 'lightblue';
      case 'ROLE_PRINCIPAL':
        return 'lightcoral';
      default:
        return 'lightgray';
    }
  };

  return (
    <Box
      sx={{
        padding: 3,
        maxWidth: 600,
        margin: '0 auto',
        backgroundImage: `url(${backgroundImage})`, // Set the background image
        backgroundSize: 'cover', // Cover the entire area
        backgroundPosition: 'center', // Center the image
        backgroundRepeat: 'no-repeat', // Do not repeat the image
      }}
    >
      <HeaderForUser sx={{ width: '100%', marginBottom: 2, display: 'flex', justifyContent: 'flex-end' }}/>
      <Typography variant="h4" gutterBottom sx={{ marginBottom: 2,marginTop: 2 }}>
        Messages
      </Typography>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <List>
          {uniqueContacts.map((contact) => (
            <ListItem key={contact.id} sx={{ display: 'flex', flexDirection: 'row' }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  maxWidth: '70%',
                  padding: 1,
                  marginBottom: 2,
                  backgroundColor: getRoleColor(contact.role), // Apply role-based background color
                  borderRadius: 1, // Optional: to round the corners
                  width: '100%', // Make the container take up full width
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                    alignItems: 'center',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 'bold', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis' }}
                    onClick={() =>
                      navigate(`/chat/${contact.id}`, {
                        state: { senderId: contact.id, senderName: contact.fullName },
                      })
                    }
                  >
                    {contact.fullName} (ID: {contact.id})
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 'normal',
                      color: 'gray',
                      backgroundColor: getRoleColor(contact.role),
                      padding: '2px 8px',
                      borderRadius: '10px',
                    }}
                  >
                    {contact.role}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'gray', fontSize: '0.85rem' }}>
                  {contact.lastMessage}
                </Typography>
                <Typography variant="caption" sx={{ color: 'gray', fontSize: '0.75rem' }}>
                  {new Date(contact.timestamp).toLocaleString()}
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
        endIcon={<SendIcon />} // Add the SendIcon to the button
        onClick={handleSendMessage}
        sx={{ mt: 2 }}
        disabled={!newMessage || !receiverId}
      >
        Send Message
      </Button>
      <Footer />
    </Box>
  );
};

export default MessagesPage;
