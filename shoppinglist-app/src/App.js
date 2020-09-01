import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import "firebase/firestore";
import { TextField, Select, MenuItem, FormControl, InputLabel, Button, Card, Grid, CardContent, OutlinedInput } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  card: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    background: '#cce6ff',
    margin: 5,
  },
  cardContent: {
  },
  controls: {
    width: 400,
    margin: 'auto',
    justifyContent: "center",
  },
  cardList: {
    margin: 'auto'
  },
  input: {
    height: 40,
  },
  selectRoot: {
    height: 40,
    verticalAlign: "middle"
  },

});

const firebaseConfig = {
  apiKey: "AIzaSyBF_H1octohvtrhO0Nhu7sAEI8ErNM9MoY",
  authDomain: "shoppinglist-414ac.firebaseapp.com",
  databaseURL: "https://shoppinglist-414ac.firebaseio.com",
  projectId: "shoppinglist-414ac",
  storageBucket: "shoppinglist-414ac.appspot.com",
  messagingSenderId: "101513348996",
  appId: "1:101513348996:web:18960bf6e905936dbd7fd1",
  measurementId: "G-RE5V58H45Y"
};

firebase.initializeApp(firebaseConfig);

function App() {
  const classes = useStyles();
  // loading state
  const[loading, setLoading] = useState(true);
  // shopping list items state
  const[items, setItems] = useState([]);
  const[item, setItem] = useState("");
  const[count, setCount] = useState(1);


  // load shopping list items
  useEffect(() => {
    const fetchData = async () => {
      // database
      const db = firebase.firestore();
      // data
      const data = await db.collection("items").get();
      // shopping list items: name, count and id
      const items = data.docs.map(doc => {
        return  { 
          name: doc.data().name, 
          count: doc.data().count, 
          id: doc.id 
        };
      });
      // set states
      setItems(items);
      setLoading(false);
    }
    // start loading data
    fetchData();
  },[]); // called only once

  // render loading... text
  if (loading) return (<p>Loading...</p>);

  // create shopping list items
  const sh_items = items.map( (item, index) => {
    return (
      <Card variant="outlined" key={index} className={classes.card} >
        <CardContent class={classes.cardContent}>
          <span style={{lineHeight: 2, paddingLeft: 10}}>{item.name} {item.count}</span> 
        </CardContent>
        <CardContent class={classes.cardContent}>
          <Button onClick={() => deleteItem(item)}  class={classes.deleteButton} >X</Button>
        </CardContent>
      </Card>);
  });

  // add a new item to data base and shopping list items
  const addItem = async () => {
    // create a new shopping list item
    let newItem =  { name: item, count: count, id: '' };
    // add to database
    const db = firebase.firestore();
    let doc = await db.collection('items').add(newItem);
    // get added doc id and set id to newItem
    newItem.id = doc.id;
    // update states
    setItems( [...items,newItem]);
    setItem("");
    setCount(1);
  }


  // delete item from database and UI
  const deleteItem = async (item) => {
    // remove from db
    const db = firebase.firestore();
    db.collection('items').doc(item.id).delete();
    // delete from items state and update state
    let filteredArray = items.filter(collectionItem => collectionItem.id !== item.id);
    setItems(filteredArray);  
  }

  // render shopping list
  return (
    <div className="App">
      <h1>Shopping List</h1>
      <Grid container direction="row"  className={classes.controls}>
        <Grid item>
          <TextField 
            label="Item"
            variant="outlined"
            InputProps={{className: classes.input}} 
            InputLabelProps={{shrink: true}}
            onChange={e => setItem(e.target.value)}/>
        </Grid>
        <Grid item>
          <FormControl>
            <Select
              className={classes.selectRoot}
              input={<OutlinedInput classes={{ input: classes.select }} />}
              labelId="demo-simple-select-placeholder-label-label"
              id="demo-simple-select-placeholder-label"
              onChange={e => setCount(e.target.value)}

            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>4</MenuItem>
              <MenuItem value={5}>5</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item>
          <Button 
            variant="outlined"
            className={classes.input} 
            onClick={() => addItem()}
          >
            Add
          </Button>
        </Grid>
      
        <Grid item xs={12}>
            {sh_items}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;