import React, { useState, useEffect } from "react";
import {StyleSheet, SafeAreaView, ScrollView, TextInput,TouchableOpacity,Alert,View,Text,Image,ActivityIndicator,
} from "react-native";
import { getDatabase, ref, push, update } from "firebase/database";

// AddBook component
export default function AddBook({ navigation, route }) {
// Get a reference to the database
  const db = getDatabase();
  
// Initial state for the form fields
  const initialState = {
    Bookname: "",
    Publisher: "",
    Year: "",
    Condition: "",
    Picture: "", 
  };

// State variables that will be used in the component
  const [newBook, setNewBook] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const isEditBook = route?.name === "Edit Book";

// If image is selected, update the Picture field then navigate to the UploadPicture screen
  useEffect(() => {
    if (route.params?.pictureUri) {
      setNewBook({ ...newBook, Picture: route.params.pictureUri });
    }
  }, [route.params?.pictureUri]);

// If the user is editing a book, set the initial state to the book details
  useEffect(() => {
    if (isEditBook) {
      const book = route.params.book;
      setNewBook(book);
    }
    return () => {
      setNewBook(initialState);
    };
  }, [isEditBook, route.params]);

  const changeTextInput = (name, event) => {
    setNewBook({ ...newBook, [name]: event });
  };

// Save the book details to the database
  const handleSave = async () => {
    const { Bookname, Publisher, Year, Condition } = newBook;
    if (!Bookname || !Publisher || !Year || !Condition) {
      return Alert.alert("Error", "All fields must be filled.");
    }
    setLoading(true);
    try {
      if (isEditBook) {
        const id = route.params.book.id;
        const bookRef = ref(db, `Books/${id}`);
        await update(bookRef, { Bookname, Publisher, Year, Condition, Picture });
        Alert.alert("Success", "Book updated successfully!");
        navigation.navigate("bookDetails", { Book: newBook });
      } else {
        const bookRef = ref(db, "Books/");
        await push(bookRef, newBook);
        Alert.alert("Success", "Book added successfully!");
        setNewBook(initialState);
      }
    } catch (error) {
      console.error(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

// Render the component that will be displayed on the screen
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.title}>
          {isEditBook ? "Edit Book Details" : "Add New Book"}
        </Text>

        {/* Form fields */}
        {Object.keys(initialState).map((key, index) => (
          <View style={styles.row} key={index}>
            <Text style={styles.label}>{key}</Text>
            {key === "Picture" ? (
              <TouchableOpacity
                style={styles.input}
                onPress={() => navigation.navigate("UploadPicture")}
              >
                {newBook.Picture ? (
                  <Image source={{ uri: newBook.Picture }} style={styles.imagePreview} />
                ) : (
                  <Text style={{ color: "#666" }}>Tap to upload picture</Text>
                )}
              </TouchableOpacity>
            ) : (
              <TextInput
                value={newBook[key]}
                onChangeText={(event) => changeTextInput(key, event)}
                style={styles.input}
                placeholder={`Enter ${key}`}
              />
            )}
          </View>
        ))}

        {/* Save Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              {isEditBook ? "Save Changes" : "Add Book"}
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  scrollView: {
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
  },
  imagePreview: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 10,
  },
  button: {
    backgroundColor: "#964B00",
    paddingVertical: 15,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#C4A484",
    fontSize: 16,
    fontWeight: "bold",
  },
});
