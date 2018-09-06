import React, { Component } from 'react';
import { auth, googleAuthProvider, database } from './firebase';
import { map, get, findKey, pick } from 'lodash';
import { Layout, Menu, Modal, Row, Col, Input  } from 'antd';

class App extends Component {
  state = {
    newSong: {
      songName: '',
      artistName: '',
      textChords: '',
    },
    currUser: null,
    data: null,
    isModal: false,
    currSong: null,
  };

  componentDidMount() {
    auth.onAuthStateChanged((currUser) => {
      this.setState({ currUser});
    });
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
    auth.signOut();
  }

  onChangeSongName = ({ target }) => {
    this.setState({
      newSong: {
        songName: target.value
      }
    })
  }
  
  onChangeArtistName = ({ target }) => {
    this.setState({
      newSong: {
        artistName: target.value,
      }
    })
  }

  onChangeTextChord = ({ target }) => {
    this.setState({
      newSong: {
        textChords: target.value,
      }
    })
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

  showModal = () => {
    this.setState({ isModal: true })
  }

  renderAddForm = () => (
    <Row>
      <Col span={12}>
        <Row style={{padding: '10px 0'}}>
          <Input placeholder="Artist" value={this.state.artistName} onChange={this.onChangeArtistName} style={{ height: 20 }}/> 
        </Row>
        <Row style={{padding: '10px 0'}}>
          <Input placeholder="Song name" value={this.state.songName} onChange={this.onChangeSongName} style={{ height: 20 }}/> 
        </Row>
        <Row style={{padding: '10px 0'}}>
          <Input.TextArea placeholder="Text" value={this.state.textChords} onChange={this.onChangeTextChord} autosize/> 
        </Row>
      </Col>
    </Row>
  );

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

  renderSongs = () => map(this.state.data, (artists, artistName) => (
    <div key={artistName}>
      <h1>{ artistName }</h1>
      <blockquote>
        { map(artists, (songKey, songName) => (
            <div key={songName}>
              <h2>{songName}</h2>
              <blockquote>
                <pre>{ map(songKey, (song) => song.textChords || song.text) }</pre>
              </blockquote>
            </div>
          )) }
      </blockquote>
    </div>
  ));

  renderSongList = () => map(this.state.data, (artists, artistName) => {
    return (
      <Menu theme="dark" mode="inline">
        { 
          map(artists, (songKey, songName) => (
            <Menu.Item key={songName}>
              <a className="nav-text" href="#" onClick={() => this.showSong(artistName, songName, songKey)}>{ artistName } - { songName }</a>
            </Menu.Item>
          ))  
        }
      </Menu>
    )
  });

  renderCurrSong = ({ artistName, songName, textChords }) => (
    <div>
      <h1>{ artistName }</h1>
      <blockquote>
        <div key={songName}>
          <h2>{songName}</h2> - {artistName}
          <blockquote>
            <pre>{ textChords }</pre>
          </blockquote>
        </div>
      </blockquote>
    </div>
  )

  showAllSongs = () => {
    this.setState({
      currSong: null,
    })
  }

  renderLayout = () => {
    const { currUser, data, currSong } = this.state;
    const { Header, Content, Sider } = Layout;

    return (
      <div>
        <Modal
          title={null}
          visible={this.state.isModal}
          closable={false}
          onOk={this.addSong}
          onCancel={this.handleCancel}
          okText="Обновить"
          style={{ 
            zIndex: 10,
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translateX(-50%) translateY(-50%)',
            background: '#FFF',
            padding: 40,
            border: '1px solid #CCC',
            borderRadius: 3,
          }}
        >
          { currUser && this.renderAddForm() }
        </Modal>
        <Layout>
          <Layout style={{ marginLeft: 400 }}>
            <Header style={{ background: '#fff', padding: 0 }} />
            
            <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            <div>
              { currSong && this.renderCurrSong(currSong) }
              { !currSong && data && this.renderSongs() }
              </div>
            </Content>
            <Sider width='auto' style={{ 
                overflow: 'auto', 
                height: '100vh', 
                position: 'fixed', 
                left: 0, 
                top: 0,
              }}>
              <button onClick={() => this.signIn()} disabled={currUser}>Sing in</button>
              <button onClick={() => this.signOut()} disabled={!currUser}>Sing out</button>
              <h1>{currUser && currUser.displayName}</h1>
              <input type="submit" disabled={!this.state.currUser} value="add song" onClick={() => this.showModal()}/>
              { this.renderSongList() }
              <input type="submit" value="show all" onClick={() => this.showAllSongs()}/>
            </Sider>
          </Layout>
        </Layout>
      </div>
    )
  }

  render() {
    return this.renderLayout(); 
  }
}

export default App;
