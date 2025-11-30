/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaProvider
} from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
import { ErrorBoundary, SplashScreen } from './src/components';

const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
  },
};

function App() {

  return (
    <ErrorBoundary>
      <React.Suspense fallback={<SplashScreen />}>
        <SafeAreaProvider>
          <NavigationContainer theme={AppTheme}>
            <MainNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </React.Suspense>
    </ErrorBoundary>
  );
}



export default App;
