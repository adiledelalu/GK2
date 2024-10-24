import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';

//Random users
const users = [
  {
    id: '1',
    name: 'Julie',
    message: 'Book: VØS',
    time: 'Today',
    avatar: 'https://www.pngall.com/wp-content/uploads/12/Avatar-PNG-Photo.png',
  },
  {
    id: '2',
    name: 'Thomas',
    message: 'Book: Informationsteknologi',
    time: '2 days ago',
    avatar: 'https://static.vecteezy.com/system/resources/thumbnails/008/846/297/small_2x/cute-boy-avatar-png.png', 
  },
];

//ChatList component
const ChatList = ({ navigation }) => {
  //Render each user in the FlatList
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('chatmessages', { userName: item.name })}>
      <View style={styles.itemContainer}>
        
        {/* Avatar */}
        <Image source={{ uri: item.avatar }} style={styles.avatar} />

        <View style={styles.messageContainer}>
          {/* Name */}
          <Text style={styles.name}>{item.name}</Text>
          {/* Last Message */}
          <Text style={styles.message}>{item.message}</Text>
        </View>

        {/* Time */}
        <Text style={styles.time}>{item.time}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      style={styles.list}
    />
  );
};

//Styles
const styles = StyleSheet.create({
  list: {
    flex: 1,
    backgroundColor: '#ff9f9',
  },
  itemContainer: {
      backgroundColor: "#fff",
      padding: 20,
      marginVertical: 10,
      marginHorizontal: 20,
      borderRadius: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 5,
      flexDirection: 'row',
      backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  messageContainer: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#333',
  },
  message: {
    color: '#888',
    fontSize: 14,
    marginTop: 2,
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
});

export default ChatList;
