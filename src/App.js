import React, { Component } from 'react';
import { auth, googleAuthProvider, database } from './firebase';
import { MainLayout, EditSongModal } from './layout';
import { get } from 'lodash';
import './styles.scss'

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

  onSignIn = () => {
    auth.signInWithPopup(googleAuthProvider).then(() => this.getSongList());
  }

  onSignOut = () => {
    auth.signOut().then(this.setState({ currUser: null}));
  }

  onAddSong = (newSong) => {
    const { artistName, songName, textChords } = newSong;

    if (artistName && songName && textChords) {
      database.ref(`catalog/${artistName}/${songName}/`).push({ artistName, songName, textChords });

      this.setState({
        songName: '',
        artistName: '',
        textChords: '',
        isModal: false,
        isEditSongMode: false,
        editingSong: null,
      });
    }
  }

  onEditSong = () => {
    this.setState({ 
      isModal: true,
      isEditSongMode: true,
     })
  }

  onModalCancel = () => {
    this.setState({ 
      isModal: false,
      isEditSongMode: false,
     })
  }

  onAddSongModal = () => {
    this.setState({ isModal: true })
  }

  onShowSong = (artistName, songName, songKey) => {
    // завести константы для сущностей
    const textChords = this.state.data[artistName][songName][Object.keys(songKey)[0]].text || this.state.data[artistName][songName][Object.keys(songKey)[0]].textChords;
    this.setState({
      currSong: {
        artistName,
        textChords,
        songName,
        songKey: Object.keys(songKey)[0],
        path: `data.${artistName}.${songName}.${Object.keys(songKey)[0]}`
      }
    });
  }
  
  onShowAllSongs = () => {
    this.setState({
      currSong: null,
    })
  }

  render() {
    const { currUser, currSong, isModal, data } = this.state;

    return (
      <div>
        <MainLayout 
          data={data}
          currUser={currUser}
          currSong={currSong}
          onShowAllSongs={this.onShowAllSongs}
          onShowSong={this.onShowSong}
          onSignIn={this.onSignIn}
          onSignOut={this.onSignOut}
          onAddSongModal={this.onAddSongModal}
          onEditSong={this.onEditSong}
        >
          <EditSongModal 
            isModal={isModal}
            currUser={currUser}
            renderAddForm={this.renderAddForm}
            onAddSong={this.onAddSong}
            onModalCancel={this.onModalCancel}
            isEditSongMode={this.state.isEditSongMode}
            currSong={currSong}
          />
        </MainLayout>
      </div>
    )
  }
}

export default App;
