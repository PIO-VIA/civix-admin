import { Text, View, StyleSheet, TouchableOpacity, TextInput, ImageBackground } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/Ionicons";
import { ThemeText } from '@/components/ThemeText';

export default function Login() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [secure, setSecure] = useState(true);

    const handleLogin = () => {
        console.log('Email:', email);
        console.log('Mot de passe:', password);
        router.replace('/(tabs)/home');
    };

    return (
        <ImageBackground source={require("../assets/images/me.jpeg")} style={styles.background} blurRadius={3}>
            <View style={styles.overlay} />

            <View style={styles.container}>
                <ThemeText variant="titrelogin" style={styles.title}>
                    <Icon name="lock-closed-outline" size={24} color="#007BFF" /> Connexion Admin
                </ThemeText>
                <Text style={styles.welcomeText}>
                 Bienvenue Admin PIO
                </Text>

                <View style={styles.inputContainer}>
                    <Icon name="mail-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Adresse email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        placeholderTextColor="#888"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="key-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secure}
                        placeholderTextColor="#888"
                    />
                    <TouchableOpacity style={styles.eyeButton} onPress={() => setSecure(!secure)}>
                        <Icon name={secure ? 'eye-off' : 'eye'} size={20} color="#888" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Se connecter</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
        alignItems: "center",
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    container: {
        width: "90%",
        padding: 25,
        borderRadius: 15,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 10,
        alignItems: "stretch",
    },
    title: {
        textAlign: "center",
        color: "#333",
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: "#fff",
    },
    input: {
        flex: 1,
        height: 50,
        paddingHorizontal: 10,
        fontSize: 16,
        color: "#333",
    },
    icon: {
        marginRight: 8,
    },
    eyeButton: {
        padding: 4,
    },
    button: {
        backgroundColor: "#007BFF",
        paddingVertical: 14,
        borderRadius: 10,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
    },
    welcomeText: {
        fontSize: 18,
        fontWeight: "500",
        color: "#333",
        marginBottom: 25,
        textAlign: "center",
        lineHeight: 24,
      },
      
});
