
import { Text, View ,StyleSheet} from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";

export default function Login() {
    const router = useRouter();
  return (
    <View style={styles.container}>
      <Text>bonjour, welcome to the app!</Text>
      <Text>Enjoy your stay!</Text>
      <View style={styles.button}>
        <Text>Login</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    background:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    container: {
        width: "90%",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    button: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#007BFF",
        borderRadius: 5,
    }

});
