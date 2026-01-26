
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Stack } from "expo-router";
import { ActivityIndicator, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from "../context/themeprovidor";
import { db } from '../db';
import migrations from '../drizzle/migrations';
import { colors } from "../styles/colors";

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);


  if (!success && !error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Erro de migração: {error.message}</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="payment" />
          <Stack.Screen
            name="(lessons)/[id]"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.second },
              headerTintColor: 'white',
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="(lessons)/one/[id]"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.second },
              headerTintColor: 'white',
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="game/[id]"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: colors.second },
              headerTintColor: 'white',
              headerShadowVisible: false,
            }}
          />
          <Stack.Screen
            name="notification"
            options={{
              headerShown: true,
              headerStyle: { backgroundColor: '#8629CF' },
              headerTintColor: 'white',
              headerShadowVisible: false,
            }}
          />
        </Stack>
      </GestureHandlerRootView>
    </ThemeProvider>
  );
}