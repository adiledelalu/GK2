import React, { useState, useEffect, useRef } from "react";
import { Camera, CameraType } from "expo-camera/legacy";
import { Button, Text, TouchableOpacity, View, ScrollView, Image, SafeAreaView, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { StatusBar } from "expo-status-bar";

//export all the camera functions
export default function CameraTest({ navigation }) {
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(CameraType.back); 
  const [imagesArr, setImagesArr] = useState([]); 
  const [gallery, setGallery] = useState(false);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef(null); 

  
  // Handle permission for camera access
  if (!permission) {
    return <View />; 
  }

  // If permission is not granted, show request button
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="Give premission" />
      </View>
    );
  }

  // Function to take a picture
  const snap = async () => {
    if (cameraRef.current) {
      setLoading(true);
      const result = await cameraRef.current.takePictureAsync();
      
      setImagesArr([...imagesArr, { uri: result.uri }]); 
      setLoading(false);
    }
  };

  // Toggles the camera type (front/back)
  const toggleCameraType = () => {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  };

  // Toggles the gallery visibility
  const toggleGallery = () => {
    setGallery((current) => !current);
  };

  // Gallery component
  const CameraGallery = () => {
    return (
      // Show the number of images taken and display them in a horizontal ScrollView
      <View style={styles.galleryContainer}>
        <Text style={styles.text}>Antal billeder taget: {imagesArr.length}</Text>
        <ScrollView horizontal={true}>
          {imagesArr.length > 0 ? (
            imagesArr.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={{ paddingHorizontal: 10 }}
                onPress={() => navigation.navigate("image", { image: image.uri })}
              >
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 80, height: 80, borderRadius: 10 }}
                />
              </TouchableOpacity>
            ))
          ) : (
            <Text style={{ color: "white" }}>No images taken</Text>
          )}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={styles.container}>
        <Camera style={styles.camera} type={cameraType} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <View style={{ flex: 1, alignSelf: "flex-end" }}>
              <TouchableOpacity style={styles.flipbtn} onPress={toggleCameraType}>
                <Ionicons name="camera-reverse-outline" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignSelf: "flex-end" }}>
              <TouchableOpacity style={styles.snapbtn} onPress={snap}>
                <Text style={styles.text}>{loading ? "Loading..." : ""}</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, alignSelf: "flex-end" }}>
              <TouchableOpacity style={styles.gallerybtn} onPress={toggleGallery}>
                <Ionicons name="copy-outline" size={32} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </Camera>
      </View>
      {/* Conditionally render gallery */}
      {gallery ? <CameraGallery /> : null}
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    marginTop: 0,
    borderRadius: 20,
    backgroundColor: "black",
    overflow: "hidden",
  },
  camera: {
    flex: 1,
    overflow: "hidden",
    width: "100%",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 32,
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    fontWeight: "semibold",
    color: "white",
    alignSelf: "center",
  },
  gallery: {
    flex: 0.2,
    paddingTop: 10,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  safeview: {
    backgroundColor: "black",
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  snapbtn: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    height: 80,
    width: 80,
    borderRadius: 100,
    padding: 10,
    margin: 5,
    alignSelf: "center",
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
  },
  flipbtn: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    borderRadius: 100,
    padding: 5,
    alignSelf: "baseline",
    justifyContent: "center",
  },
});
