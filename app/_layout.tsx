import { Stack } from "expo-router";
import {  SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {
  return( 
    <SafeAreaView edges={['top']} style={{ flex: 1 }}>
    <Stack screenOptions={{ 
      headerShown: false,
      animation: 'slide_from_right',
      gestureEnabled: true,
    }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />

      
    </Stack>
    </SafeAreaView>
  );
}
