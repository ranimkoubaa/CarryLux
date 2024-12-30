import React from 'react';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      
      <Stack.Screen name="ProfileScreen" options={{ title: 'Profile' }} />
      <Stack.Screen 
        name="UserScreen" 
        options={{ headerShown: false }}  // This hides the top bar
      />
      <Stack.Screen 
        name="index" 
        options={{ headerShown: false }}  // This hides the top bar
      />
      <Stack.Screen 
        name="LoginScreen" 
        options={{ headerShown: false }}  // This hides the top bar
      />
      <Stack.Screen 
        name="RegisterScreen" 
        options={{ headerShown: false }}  // This hides the top bar
      />
    </Stack>
  );
};

export default Layout;

/*
// app/layout.tsx
import React from 'react';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import * as eva from '@eva-design/eva';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <ApplicationProvider {...eva} theme={eva.light}>
      <IconRegistry icons={EvaIconsPack} />
      <Stack>
      
        <Stack.Screen name="Index" options={{ title: 'Home' }} />
        <Stack.Screen name="LoginScreen" options={{ title: 'Login' }} />
        <Stack.Screen name="RegisterScreen" options={{ title: 'Register' }} />
        <Stack.Screen name="ProfileScreen" options={{ title: 'Profile' }} />
        <Stack.Screen name="UserScreen" options={{ headerShown: false }} />
      </Stack>
    </ApplicationProvider>
  );
};

export default Layout;
*/