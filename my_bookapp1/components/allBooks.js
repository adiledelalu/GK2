import * as React from "react";
import {StyleSheet, Text, View, FlatList, TouchableOpacity,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { useState, useEffect } from "react";

export default function BookList({ navigation }) {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch data from Firebase
  useEffect(() => {
    const db = getDatabase();
    const booksRef = ref(db, "Books");

    const unsubscribe = onValue(
      booksRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          console.log("Data received from Firebase: ", data);

          // Convert object to array
          const booksList = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setBooks(booksList);
        } else {
          setError("No books found.");
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching data: ", error);
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);


  // Show error message if something goes wrong
  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Function to handle selecting a book
  const handleSelectBook = (id) => {
    const selectedBook = books.find((book) => book.id === id);
    if (selectedBook) {
      navigation.navigate("BookDetails", { book: selectedBook });
    } else {
      console.error("Book with ID " + id + " not found");
    }
  };

  // Render each book in the FlatList
  return (
    <FlatList
      data={books}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.bookCard}
          onPress={() => handleSelectBook(item.id)}
        >
          <Text style={styles.bookTitle}>{item.Bookname}</Text>
          <Text style={styles.bookDetails}>
            {item.Publisher} - {item.Year}
          </Text>
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <View style={styles.centeredContainer}>
          <Text style={styles.emptyText}>Loading</Text>
        </View>
      }
    />
  );
}

// Styles
const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
  },
  errorText: {
    fontSize: 18,
    color: "#ff5a5a",
    textAlign: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  bookCard: {
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
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  bookDetails: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },
});