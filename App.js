import React from 'react';
import { Loader } from './src/component';
import Nav from './src/navigation';
import { StoreProvider } from './src/context/store';
import { LogBox, Platform } from 'react-native';

if (Platform.OS !== 'web') {
  LogBox.ignoreLogs(['Setting a timer']);
}
console.reportErrorsAsExceptions = false;

export default function App() {
  return (
    <StoreProvider>
      <Nav />
      <Loader />
    </StoreProvider>
  );
}
