/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {
  SafeAreaProvider
} from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import MainNavigator from './src/navigation/MainNavigator';
const AppTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
  },
};

function App() {

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={AppTheme}>
        <MainNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}



export default App;
