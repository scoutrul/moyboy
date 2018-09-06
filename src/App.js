import React, { Component } from 'react';
import { auth, googleAuthProvider, database } from './firebase';
import { MainLayout, EditSongModal } from './layout';

class App extends Component {
  state = {
    currUser: null,
    data: null,
    isModal: false,
    currSong: null,
  };

  componentDidMount() {
    auth.onAuthStateChanged((currUser) => {
      this.setState({ currUser});
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
    auth.signInWithPopup(googleAuthProvider).then(() => this.getSongList());
  }

  signOut = () => {
    auth.signOut().then(this.setState({ currUser: null}));
  }

  addSong = () => {
    const { newSong } = this.state;
    const { artistName, songName, textChords } = newSong;

    if (artistName && songName && textChords) {
      database.ref(`catalog/${artistName}/${songName}/`).push({ artistName, songName, textChords });

      this.setState({
        songName: '',
        artistName: '',
        textChords: '',
        isModal: false,
      });
    }
  }

  handleCancel = () => {
    this.setState({ isModal: false })
  }

  isEditSongModal = () => {
    this.setState({ isModal: true })
  }

  showSong = (artistName, songName, songKey) => {
    const textChords = this.state.data[artistName][songName][Object.keys(songKey)[0]].text;
    this.setState({
      currSong: {
        artistName,
        textChords,
        songName,
      }
    })
  }

  showAllSongs = () => {
    this.setState({
      currSong: null,
    })
  }

  render() {
    const { currUser, currSong, isModal, data } = this.state;

    return (
      <div>
        <EditSongModal 
          isModal={isModal}
          currUser={currUser}
          renderAddForm={this.renderAddForm}
          addSong={this.addSong}
          handleCancel={this.handleCancel}
        />
        <MainLayout 
          currUser={currUser}
          currSong={currSong}
          showAllSongs={this.showAllSongs}
          signIn={this.signIn}
          signOut={this.signOut}
          isEditSongModal={this.isEditSongModal}
          data={data}
        />
      </div>
    )
  }
}

export default App;
