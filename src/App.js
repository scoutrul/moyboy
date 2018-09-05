import React, { Component } from 'react';
import { auth, googleAuthProvider, database } from './firebase';
import { map } from 'lodash';

class App extends Component {
  state = {
    currUser: null,
    songName: '',
    artistName: '',
    textChord: '',
    data: null,
  };

  componentDidMount() {
    auth.onAuthStateChanged((currUser) => {
      this.setState({ currUser})
    });
    this.getSongList();


  }

  componentDidUpdate() {
    console.log(this.state);
  }

  getSongList = () => {
    database.ref('catalog').on('value', (snapshot) => {
      this.setState({
        data: snapshot.val(),
      })
    })
  }

  signIn = () => {
    auth.signInWithPopup(googleAuthProvider);
  }

  signOut = () => {
    auth.signOut();
  }

  onChangeSongName = ({ target }) => {
    this.setState({
      songName: target.value,
    })
  }
  
  onChangeArtistName = ({ target }) => {
    this.setState({
      artistName: target.value,
    })
  }

  onChangeTextChord = ({ target }) => {
    this.setState({
      textChords: target.value,
    })
  }

  addSong = (e) => {
    e.preventDefault();
    const { artistName, songName, textChords } = this.state;

    if (artistName && songName && textChords) {
      database.ref(`catalog/${artistName}/${songName}/`).push({ text: textChords });

      this.setState({
        songName: '',
        artistName: '',
        textChords: '',
      });
    }
  }

  addSongForm = () => (
    <div>
      <form onSubmit={this.addSong}>
        <div>
          <label>
            Artist
          <input value={this.state.artistName} onChange={this.onChangeArtistName}/> 
          </label>
        </div>
        <div>
          <label>
            Song name
          <input value={this.state.songName} onChange={this.onChangeSongName}/> 
          </label>
        </div>
        <div>
          <label>
            Text
          <textarea value={this.state.textChords} onChange={this.onChangeTextChord} /> 
          </label>
        </div>
        <input type="submit" disabled={!this.state.currUser} value="add song" />
      </form>
    </div>
  );

  renderSongs = () => {
    const { data } = this.state;
    return map(data, (artists, artistName) => {
      return (
        <div>
          <h1>{ artistName }</h1>
          <blockquote>
            { 
              map(artists, (song, songName) => {
                const chordText = map(song, (song) => song.text)
                return (
                  <div>
                    <h2>{songName}</h2>
                    <blockquote>
                    <pre>{chordText}</pre>
                    </blockquote>
                  </div>
                )
              }) 
            }
          </blockquote>
        </div>
      )
    });
  }

  render() {
    const { currUser, data } = this.state;

    return (
      <div className="App">
        <button onClick={() => this.signIn()} disabled={currUser}>Sing in</button>
        <button onClick={() => this.signOut()} disabled={!currUser}>Sing out</button>

        <h1>
          {currUser && currUser.displayName}
        </h1>

        {currUser && this.addSongForm()}

        {data && this.renderSongs()}
      </div>
    ); 
  }
}

export default App;
