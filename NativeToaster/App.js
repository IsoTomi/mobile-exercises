import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button
} from 'react-native';

import ToastExample from './ToastExample';

const App: () => React$Node = () => {
  return (
    <View style={styles.container}>
      <Button onPress={() => {ToastExample.show('Button pressed!', ToastExample.SHORT);}} title="Press Me!" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
