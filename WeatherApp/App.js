import React, { Component, useState, useEffect } from 'react';
import { ScrollView, AsyncStorage, Image } from 'react-native';
import { Container, Header, Title, Button, Left, Right, Body, 
          Text, Form, Item, Input, Card, CardItem } from 'native-base';
import Dialog from "react-native-dialog";
import useAxios from 'axios-hooks';


const WeatherForecast = (params) => {
  const city = params.city;
  const API_KEY = '0c3e0d443392190d83d90c6f6232b823';
  const API_ICON = 'https://openweathermap.org/img/w/'
  const URL = 'https://api.openweathermap.org/data/2.5/weather?q=';

  const [{ data, loading, error}, refetch] = useAxios(
    URL+city+'&appid='+API_KEY+'&units=metric&lang=fi'
  )

  if (loading) return <Text>Loading...</Text>
  if (error) return <Text>Error!</Text>

  let date = new Date(data.dt * 1000);
  console.log(date.toGMTString());

  const refreshForecast = () => {
    refetch();
  }

  const deleteCity = () => {
    params.deleteCity(params.id);
  }

  return (
    <Card>
      <CardItem header bordered>
          <Text>{city}</Text> 
        <Right>
          <Text>{date.toGMTString()}</Text>
        </Right>
      </CardItem>
      <CardItem cardBody>
        <Left>
          <Body>
            <Text>Condition: {data.weather[0].main}</Text>
            <Text>Temperature: {data.main.temp} °C</Text>
            <Text>Humidity: {data.main.humidity} % </Text>
            <Text>Pressure: {data.main.pressure} hPa </Text>
          </Body>
        </Left>
          <Right>
            <Image source={{uri: API_ICON+data.weather[0].icon+'.png'}} style={{width: 150, height: 150}} />
          </Right>
      </CardItem>
      <CardItem footer >
        <Left>
          <Button transparent onPress={() => refreshForecast()}><Text>Refresh</Text></Button>
        </Left>
        <Right>
          <Button transparent onPress={() => deleteCity()}><Text>Remove</Text></Button>
        </Right>
      </CardItem>
      
    </Card>
  )
}

const App: () => React$Node = () => {
  
  const [modalVisible, setModalVisible] = useState(false);
  const [cityName, setCityName] = useState("");
  const [cities, setCities] = useState([]);

  const openDialog = () => {
    setModalVisible(true);
  }
  
  const addCity = () => {
    setCities([...cities, {id:cities.length, name:cityName}]);
    setModalVisible(false);
  }
  
  const cancelCity = () => {
    setModalVisible(false);
  }

  const deleteCity = (id) => {
    let filteredArray = cities.filter(city => city.id !== id);
    setCities(filteredArray);
  }

  const storeData = async () => {
    try {
      await AsyncStorage.setItem('@cities', JSON.stringify(cities));
    } catch (e) {
      console.log("Cities saving error!");
    }
  }

  const getData = async () => {
    try {
      const value = await AsyncStorage.getItem('@cities');
      if (value !== null) {
        setCities(JSON.parse(value));
      }
    } catch(e) {
      console.log("Cities loading error!");
    }
  }

  // load cities when app starts
  useEffect(() => {
    getData();
  },[]);  

// save cities if cities state changes
  useEffect(() => {
    storeData();
  },[cities]); 

  return (
    <Container>
      <Header>
        <Left/>
        <Body>
          <Title>Weather App</Title>
        </Body>
        <Right>
          <Button>
            <Text onPress={openDialog}>Add</Text>
          </Button>
        </Right>
      </Header>

      <ScrollView>
      {!modalVisible && cities.map(function(city,index){
        return (
          <WeatherForecast 
            key={index} 
            city={city.name} 
            id={city.id} 
            deleteCity={deleteCity} />
        )
      })}
      </ScrollView>

      <Dialog.Container visible={modalVisible}>
        <Dialog.Title>Add a new city</Dialog.Title>
          <Form>
            <Item>
              <Input onChangeText={ (text) => setCityName(text)} placeholder="cityname"/>
            </Item>
          </Form>
          <Dialog.Button label="Cancel" onPress={cancelCity} />
          <Dialog.Button label="Add" onPress={addCity} />
      </Dialog.Container>
    </Container>
  );
};

export default App;
