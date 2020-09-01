import React from 'react';
import {
  Platform,
  Linking,
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  StatusBar,
} from 'react-native';


const App: () => React$Node = () => {
  const [latitude, setLatitude] = React.useState(0);
  const [longitude, setLongitude] = React.useState(0);

  const launchMap = () => {
    const location = `${latitude},${longitude}`
    const url = Platform.select({
      ios: `maps:${location}`,
      android: `geo:${location}?center=${location}&q=${location}&z=16`,
    });
    Linking.openURL(url);
  }

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.area}>
          <Text>Give latitude value:</Text>
          <TextInput placeholder='Latitude' onChangeText={text => setLatitude(text)}/>
          <Text>Give longitude value:</Text>
          <TextInput placeholder='Longitude' onChangeText={text => setLongitude(text)}/>
          <Button title="Launch a Map" onPress={launchMap}/>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  area: {
    margin: 20
  }
});

export default App;