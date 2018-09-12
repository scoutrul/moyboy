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
    console.log('APP state', this.state);
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

  updateSong = ({ artistName, songName, textChords, songKey }) => {
    if (artistName && songName && textChords) {
      if(this.state.isEditSongMode){
        //update
        database.ref(`catalog/${artistName}/${songName}/${songKey}`).update({ artistName, songName, textChords });
      } else {
        // new 
        database.ref(`catalog/${artistName}/${songName}/`).push({ artistName, songName, textChords });
      }

      this.setState({
        songName: '',
        artistName: '',
        textChords: '',
        isModal: false,
        isEditSongMode: false,
        editingSong: null,
      });
    } else {
      console.log('input error')
    }
  }

  onEditSong = () => {
    this.setState({ 
      isModal: true,
      isEditSongMode: true,
     })
  }

  onDeleteSong = ({ songPath, songKey }) => {
    database.ref(songPath).child(songKey).remove();
    this.onShowAllSongs();
  }

  onModalCancel = () => {
    this.setState({ 
      isModal: false,
      isEditSongMode: false,
     })
  }

  onAddSongModal = () => {
    this.setState({ 
      isModal: true,
      isEditSongMode: false,
     })
  }

  onShowSong = (artistName, songName, songKey) => {
    let key = Object.keys(songKey)[0];
    // завести константы для сущностей
    const textChords = this.state.data[artistName][songName][key].text || this.state.data[artistName][songName][key].textChords;
    this.setState({
      currSong: {
        artistName,
        textChords,
        songName,
        songKey: key,
        songPath: `catalog/${artistName}/${songName}`
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
          onDeleteSong={this.onDeleteSong}
        />
        <EditSongModal 
          currSong={currSong}
          currUser={currUser}
          isModal={isModal}
          isEditSongMode={this.state.isEditSongMode}
          updateSong={this.updateSong}
          onModalCancel={this.onModalCancel}
          renderAddForm={this.renderAddForm}
        />
      </div>
    )
  }
}

export default App;
