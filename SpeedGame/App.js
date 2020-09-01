import * as React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { Header, Icon, Button, ThemeProvider, Text } from 'react-native-elements';
import Dialog from "react-native-dialog";

export default function SpeedGame() {
  // Hooks
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Game' },
    { key: 'second', title: 'Highscores' },
  ]);
  const [timeOne, setTimeOne] = React.useState(0);
  const [score, setScore] = React.useState(0);
  const [addDialogVisible, setAddDialogVisible] = React.useState(false);
  const [name, setName] = React.useState("");
  const [players, setPlayers] = React.useState([]);

  // Realm related
  const Realm = require('realm');

  const Player = {
    name: 'Player',
    properties: {
        name: 'string',
        score: {type: 'int', default: 0},
    },
  };

  const realm = new Realm({schema: [Player]});

  // Routes
  const FirstRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]}>
      <Text style={styles.text}>Double tap the circle as fast as you can!</Text>
      <View style={styles.circle} onTouchStart={circlePressed}/>
      <Text style={styles.text}>Time: {score}</Text>
      <View style={styles.row}>
        <View style={styles.button}>
          <Button  title="Add highscores" onPress={() => setAddDialogVisible(true)} />
        </View>
        <View style={styles.button}>
          <Button  title="Reset time" onPress={() => {setTimeOne(0); setScore(0);}} />
        </View>
      </View>
    </View>
  );

  const SecondRoute = () => (
    <View style={[styles.scene, { backgroundColor: '#fff' }]}>
      <ScrollView>
        {players.map((player, index) => {
          return (
            <View key={index} style={styles.highscore}>
              <Text style={styles.highscoreName}>{player.name}</Text>
              <Text style={styles.highscoreScore}>{player.score}</Text>
            </View>
          )
        })}
      </ScrollView>
    </View>
  );

  // Functions
  const initialLayout = { width: Dimensions.get('window').width };

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute />;
      case 'second':
        return <SecondRoute />;
      default:
        return null;
    }
  };

  const indexChange = (index) => {
    // change tab index from code   
    setIndex(index);
    
    if (index === 1) {
      // load highscores
      let players = realm.objects('Player').sorted('score');
      let playersArray = Array.from(players);
      setPlayers(playersArray);
    }
  }

  const circlePressed = () => {
    // get start time - first press
    if (timeOne === 0) {
      const date = new Date();
      setTimeOne(date.getTime());
      setScore(0);
    // second press, calc time and store
    } else {
      const date = new Date();
      setScore(date.getTime() - timeOne);
    } 
  }

  const okClicked = () => {
    setAddDialogVisible(false);
    // add highscore
    realm.write(() => {
      const player = realm.create('Player', {
        name: name,
        score: score,
      });
    });
    
  }


  return (
    <ThemeProvider>
      <Header
        leftComponent={ <Icon name="menu" color='#fff' /> }
        centerComponent={{ text: 'SPEED GAME', style: { color: '#fff' } }}
      />
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={indexChange}
        initialLayout={initialLayout}
      />
      <Dialog.Container visible={addDialogVisible}>
        <Dialog.Title>Add a new highscore</Dialog.Title>
        <Dialog.Input label="Name" placeholder="Click and type your name here" onChangeText={text => setName(text)}/>
        <Dialog.Button label="Ok" onPress={okClicked} />
      </Dialog.Container>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
  circle: {
    width: 150,
    height: 150,
    borderRadius: 150/2,
    backgroundColor: 'red',
    alignSelf : "center",
    marginTop: 100
  },
  text: {
    marginTop: 50,
    alignSelf : "center"
  },
  button: {
    marginRight: 20,
    marginTop: 50,
    alignSelf : "center",
    width: 150
  },
  row: {
    flexDirection: 'row',
    alignSelf : "center"
  },
  highscore: {
    flexDirection: 'row',
    margin: 10,
  },
  highscoreName: {
    fontSize: 20,
    color: 'black',
    width: '50%',
    textAlign: 'right',
    marginRight: 5
  },
  highscoreScore: {
    fontSize: 20,
    color: 'gray',
    width: '50%',
    marginLeft: 5
  }
});