import { Text, View, StyleSheet, TouchableOpacity, TextInput,ImageBackground} from "react-native";
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
        // Appelle ton backend ici
        router.push('/home'); 
    };

    return (
        <ImageBackground source={require("../assets/images/me.jpeg")} style={styles.background}>

            <View style={styles.container}>
            <ThemeText variant="titrelogin" >
            <Icon name="login" size={20} color="purple" /> Connexion
            </ThemeText>
                <TextInput
                    style={styles.input}
                    placeholder="Adresse email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <View style={styles.passwordContainer}>
                    <TextInput
                        style={styles.passwordInput}
                        placeholder="Mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={secure}
                    />
                    <TouchableOpacity style={styles.eyeButton} onPress={() => setSecure(!secure)}>
                        <Icon
                            name={secure ? 'eye-off' : 'eye'}
                            size={24}
                            color="#888"
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f5f5f5",
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
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        width: "100%",
    },
    passwordContainer: {
        position: 'relative',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 20,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        height: 50,
        width: "100%",
    },
    passwordInput: {
        flex: 1,
        height: '100%',
        paddingHorizontal: 15,
    },
    eyeButton: {
        position: 'absolute', 
        right: 10, 
        top: 13,
        justifyContent: 'center',
        alignItems: 'center',
        height: 24,
        width: 24, 
    },
});
