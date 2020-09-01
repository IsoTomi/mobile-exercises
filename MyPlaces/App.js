import React, { useState } from 'react';
import { AppLoading } from 'expo';
import { 
  Form, Item, Input, Container, Header, Left, Body, Title, Right, Text, Button, Grid, Row 
} from 'native-base';
import { View, Dimensions, StyleSheet } from 'react-native';
import * as Font from 'expo-font';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import { Dialog } from 'react-native-simple-dialogs';
import AsyncStorage from '@react-native-community/async-storage';

const axios = require('axios');

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false,
      errorMsg: null,
      initLocation: null,
      modalVisible: false,
      cityName: "",
      commentText: "",
      cities: []
    };
  }

  storeData = async () => {
    try {
      await AsyncStorage.setItem('@cities', JSON.stringify(this.state.cities));
    } catch (e) {
      console.log("Cities saving error!");
    }
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cities')
      if(value !== null) {
        this.setState({cities: JSON.parse(value)});
      }
    } catch(e) {
      console.log("Cities loading error!");
    }
  }

  clearData = async () => {
    try {
      await AsyncStorage.removeItem('@cities')
    } catch(e) {
      console.log("Cities clearing error!");
    }
  }

  async componentDidMount() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
      ...Ionicons.font,
    });
    this.setState({ isReady: true });

    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }

    let location = await Location.getCurrentPositionAsync({});
    this.setState({initLocation: location});

    this.getData();
  }

  openDialog = () => {
    this.setState({modalVisible: true});
  }

  removeAll = () => {
    this.setState({cities: []});
    this.clearData();
  }

  addCity = () => {
    let temp = this.state.cities;
    temp[temp.length] = {id:this.state.cities.length, name:this.state.cityName, comment:this.state.commentText};
    this.setState({cities: temp})
    this.storeData();
    this.setState({modalVisible: false});
  }

  cancelCity = () => {
    this.setState({modalVisible: false});
  }


  render() {
    let latitude = 0;
    let longitude = 0;

    if (!this.state.isReady) {
      return <AppLoading />;
    }

    if (this.state.initLocation) {
      latitude = this.state.initLocation.coords.latitude;
      longitude = this.state.initLocation.coords.longitude;
    } else {
      return (
        <Text>Waiting...</Text>
      );
    }

    return (
      <Container>
        <Header>
          <Body>
            <Title>My Places</Title>
          </Body>
          <Right>
            <Button>
              <Text onPress={this.removeAll}>Remove All</Text>
            </Button>
            <Button>
              <Text onPress={this.openDialog}>Add</Text>
            </Button>
          </Right>
        </Header>

        <View style ={{
          height: Dimensions.get('window').height,
          width: Dimensions.get('window').width,
        }}>
          <MapView
            style={{...StyleSheet.absoluteFillObject}}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 2.19,
              longitudeDelta: 1.00,
            }} >
            
            {this.state.cities.map(city => (            
            <PlaceMarker key={city.id} city={city.name} comment={city.comment} />
          ))}

          </MapView>
        </View>

        <Dialog
          visible={this.state.modalVisible}
          title="Add a new marker"
          onTouchOutside={() => this.setState({modalVisible: false})} >
          <View>
            <Form>
              <Item>
                <Input onChangeText={ (text) => this.setState({cityName: text})} placeholder="City"/>
              </Item>
              <Item>
                <Input onChangeText={ (text) => this.setState({commentText: text})} placeholder="Comment"/>
              </Item>
            </Form>
            <View style={styles.container}>
              <Button info onPress={this.cancelCity}><Text>Cancel</Text></Button>
              <Button info onPress={this.addCity}><Text>Add</Text></Button>
            </View>  
          </View>
        </Dialog>
      </Container>
    );
  }
}

class PlaceMarker extends React.Component {
  API_KEY = '0c3e0d443392190d83d90c6f6232b823';
  URL = 'https://api.openweathermap.org/data/2.5/weather?q=';

  constructor(props) {
    super(props);
    this.state = {
      latitude: 0,
      longitude: 0
    };
  }

  componentDidMount() {
    axios.get(this.URL + this.props.city + '&appid=' + this.API_KEY).then((response) => {
      this.setState({latitude: response.data.coord.lat});
      this.setState({longitude: response.data.coord.lon});
    }).catch((error) => {
      console.log(error);
    });
  }

  render() {
    return (
      <MapView.Marker key={this.props.id} 
        coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}} 
        title={this.props.city} 
        description={this.props.comment} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flexDirection: 'row',
      marginTop: 20,
      marginHorizontal: 20,
      justifyContent: 'space-between'
  }
});
