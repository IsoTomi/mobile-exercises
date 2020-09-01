import React, { useState } from 'react';
import './App.css';

// import for Material-UI
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// Rechart
import {
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';

// styles for Material-UI
const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

function App() {
  const axios = require('axios').default;
  // material-UI classes
  const classes = useStyles();
  // hook for stock symbol
  const [symbol, setSymbol] = useState('');
  const [data, setData] = useState([]);

  // load stocks
  const loadStock = (symbol) => {
    // use your own server for testing
    //const URL_PATH = 'https://YOUR_SERVER/PATH/';
    //const url = URL_PATH + symbol + '.json';
  
    // use in real case
    const API_KEY = 'SGKFMCPQSFU5SEEC';
    const URL_PATH = 'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY';
    const url = URL_PATH + '&symbol='+symbol+'&apikey='+API_KEY;
  
    // use axios to get data
  // use axios to get data
  axios.get(url)
    .then(res => {
      // store loaded data to local variable
      var data = [];
      // take only 10 first
      var countMAX = 10;
      var count = 0;
      // loop keys stored in json like: "2020-02-20", "2020-02-21", etc...
      Object.keys(res.data["Time Series (Daily)"]).forEach(function(key) {
        // add count and take only countMAX 
        count++;
        if (count < countMAX) {
          // push loaded json data to array with keys: data, open, etc...
          data.push(
            {
              'date': key,
              'open': res.data["Time Series (Daily)"][key]["1. open"],
              'high': res.data["Time Series (Daily)"][key]["2. high"],
              'low': res.data["Time Series (Daily)"][key]["3. low"],
              'close': res.data["Time Series (Daily)"][key]["4. close"],
              'volume': res.data["Time Series (Daily)"][key]["5. volume"],
            }
          );
        }
      });
      setData(data);
    })
  }
  

  // handle stock symbol change from InputLabel
  const handleChange = event => {
    setSymbol(event.target.value);
    loadStock(event.target.value);
  }

  return (
    <div className="App">
      <h1>Stock - Time Series</h1>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">Symbol</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={symbol}
          onChange={handleChange}
        >
          <MenuItem value='AAPL'>Apple</MenuItem>
          <MenuItem value='AMZN'>Amazon</MenuItem>
          <MenuItem value='NOK'>Nokia</MenuItem>
          <MenuItem value='TSLA'>Tesla</MenuItem>
        </Select>
      </FormControl>
      <div style={{width: '100%', height: '400px'}}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={['dataMin', 'dataMax']}/>
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="open" stroke="#8884d8" activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="close" stroke="#82ca9d" />
            <Line type="monotone" dataKey="high" stroke="#ff0000" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default App;
