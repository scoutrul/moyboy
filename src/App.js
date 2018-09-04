import React, { Component } from 'react';
import { auth, googleAuthProvider } from './firebase';

class App extends Component {
  state = {
    currUser: null,
    songName: null,
  };

  componentDidMount() {
    auth.onAuthStateChanged((currUser) => {
      this.setState({ currUser})
    })
  }

  componentDidUpdate() {
    console.log(this.state)
  }

  signIn = () => {
    auth.signInWithPopup(googleAuthProvider);
  }

  signOut = () => {
    auth.signOut();
  }

  addSong = (e) => {
    e.preventDefault();
    this.setState({
      songName: '',
    })
  }

  onChangeSongName = ({ target }) => {
    this.setState({
      songName: target.value,
    })
  }

  render() {
    return (
      <div className="App">
        <button onClick={() => this.signIn()} disabled={this.state.currUser}>Sing in</button>
        <button onClick={() => this.signOut()} disabled={!this.state.currUser}>Sing out</button>

        <h1>
          {this.state.currUser && this.state.currUser.displayName}
        </h1>

        <form onSubmit={this.addSong}>
          <label>
            Song name
            <input type="text" value={this.state.songName} onChange={this.onChangeSongName}/> 
          </label>
          <input type="submit" disabled={!this.state.currUser} value="add song" />
        </form>
      </div>
    );
  }
}

export default App;
