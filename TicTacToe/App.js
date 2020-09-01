import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

// calculateWinner - Calculates the winner.
function calculateWinner(squares) {
  const lines = [
    // Horizontally
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Vertically
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // From Top-Left to Bottom-Right
    [0, 4, 8],
    // From Top-Right to Bottom-Left
    [2, 4, 6]
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines [i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// Square - Function Component
function Square(props) {
  return (
    <Text style={styles.square} onPress={props.onPress} >
      {props.value}
    </Text>
  );
}

// Board - Class Component
class Board extends React.Component {
  // Board Constructor
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    };
  }

  // resetGame - Resets the game.
  resetGame() {
    this.setState({
      squares: Array(9).fill(null),
      xIsNext: true,
    })
  }

  // handlePress - handles the onPress-event.
  handlePress(i) {
    const squares = this.state.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  // renderSquare - Renders the squares and pass down the props.
  renderSquare(i) {
    return (
      <Square
        value={this.state.squares[i]}
        onPress={() => this.handlePress(i)}
      />
    );
  }

  // render - Main rendering function.
  render () {
    const winner = calculateWinner(this.state.squares);
    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return  (
      <View style={styles.board}>
        <View style={styles.title}>
          <Text style={{fontSize: 40, fontWeight: 'bold'}}>Tic Tac Toe</Text>
        </View>
        <View style={styles.boardGrid}>
          <View style={styles.boardRow}>
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </View>
          <View style={styles.boardRow}>
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </View>
          <View style={styles.boardRow}>
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </View>
        </View>
        <View style={styles.status}>
          <Text style={{fontSize: 20}}>{status}</Text>
        </View>
        <View style={styles.button}>
          <Button title="RESET GAME" onPress={() => this.resetGame() }/>
        </View> 
      </View>
    );
  }
}

// App - Main function component
export default function App() {
  return (
    <View style={styles.container}>
        <Board />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    margin: 20,
    
  },
  square: {
    height: 100,
    width:100,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#999',
    fontSize: 34,
    fontWeight: 'bold',
    marginRight: -1,
    marginTop: -1,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  title: {
    marginBottom: 20,
    alignItems: 'center'
  },
  board: {
    justifyContent: 'space-evenly'
  },
  boardGrid: {

  },
  boardRow: {
    flexDirection: 'row'
  },
  status: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    justifyContent: 'center',
    marginTop: 20,
  }
});
