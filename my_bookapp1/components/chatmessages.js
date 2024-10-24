import React, { useState } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

// ChatMessages component
const ChatMessages = ({ route }) => {
  const { userName } = route.params;
  
  // State for messages and new input (Random messages for testing)
  const [messages, setMessages] = useState([
    { id: '1', sender: userName, text: 'Hi, I want to buy your book from VØS5.' },
    { id: '2', sender: 'You', text: 'Great, what do you prefer? me sending it or meet up?' }
  ]);
  const [newMessage, setNewMessage] = useState('');

  // Function to handle sending a message
  const sendMessage = () => {
    if (newMessage.trim()) {
      const newMsg = { id: Date.now().toString(), sender: 'You', text: newMessage };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage(''); // Clear the input after sending
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageBubble, item.sender === 'You' ? styles.myMessage : styles.theirMessage]}>
      <Text style={styles.sender}>{item.sender}</Text>
      <Text>{item.text}</Text>
    </View>
  );

  // Render the component
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chat with {userName}</Text>

      {/* List of messages */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        style={styles.messageList}
      />

      {/* Input field and send button */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="Type your message..."
        />
        {/* Send button */}
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  messageList: {
    flex: 1,
    marginBottom: 10,
  },
  messageBubble: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  myMessage: {
    backgroundColor: '#964B00',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#C4A484',
    alignSelf: 'flex-start',
  },
  sender: {
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  input: {
    flex: 1,
    borderColor: '#fff',
    borderWidth: 2,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatMessages;
