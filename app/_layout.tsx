import { Stack } from "expo-router";
import { ThemeProvider } from "../context/themeprovidor";
import { colors } from "../styles/colors";



export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack >
        <Stack.Screen name="index" options={{ title: 'Home', headerShown: false }} />
        <Stack.Screen name="signup" options={{ title: '', headerShown: false }} />
        <Stack.Screen name="(drawer)" options={{ title: '', headerShown: false }} />
        <Stack.Screen name="payment" options={{ title: '', headerShown: false }} />
        <Stack.Screen name="profile" options={{
          title: '', headerShown: false,
          headerStyle: { backgroundColor: colors.perfilbar },
          headerTintColor: 'white',
          headerTitleStyle: { color: 'white' },
          headerShadowVisible: false,
        }} />

        <Stack.Screen name="[id]" options={{
          title: '', headerShown: true,
          headerStyle: { backgroundColor: colors.second },
          headerTintColor: 'white',
          headerTitleStyle: { color: 'white' },
          headerShadowVisible: false,
        }} />
        <Stack.Screen name="notification" options={{
          title: '', headerShown: true,
          headerStyle: { backgroundColor: '#8629CF' },
          headerTintColor: 'white',
          headerTitleStyle: { color: 'white' },
          headerShadowVisible: false,
        }} />

      </Stack >

    </ThemeProvider>

  );
}
