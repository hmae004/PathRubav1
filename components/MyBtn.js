import React from "react";
import { TouchableOpacity, Text,Pressable,StyleSheet } from "react-native";

function MyBtn({ text, onPress }) {
  return (
    <Pressable
      style={{
        backgroundColor: "#040720",
        padding: 10,
        borderRadius: 20,
        width: "80%",
      }}
      onPress={(e) => {
        onPress(e);
      }}
    >
      <Text
        style={{
          color: "white",
          textAlign: "center",
          fontFamily: "serif",
          fontWeight:"bold"
        }}
      >
        {text}
      </Text>
    </Pressable>
  );
}

export default MyBtn;