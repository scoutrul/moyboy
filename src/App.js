import React, { Component } from 'react';
import { auth, googleAuthProvider, database } from './firebase';
import { map } from 'lodash';
import { Layout, Menu, Modal, Row, Col, Input  } from 'antd';

class App extends Component {
  state = {
    currUser: null,
    songName: '',
    artistName: '',
    textChord: '',
    data: null,
    isModal: false,
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

  addSong = () => {
    const { artistName, songName, textChords } = this.state;

    if (artistName && songName && textChords) {
      database.ref(`catalog/${artistName}/${songName}/`).push({ text: textChords });

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

  renderSongs = () => map(this.state.data, (artists, artistName) => (
    <div key={artistName}>
      <h1>{ artistName }</h1>
      <blockquote>
        { map(artists, (song, songName) => (
            <div key={songName}>
              <h2>{songName}</h2>
              <blockquote>
                <pre>{ map(song, (song) => song.text) }</pre>
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
          map(artists, (song, songName) => (
            <Menu.Item key={songName}>
              <span className="nav-text">{ artistName } - { songName }</span>
            </Menu.Item>
          ))  
        }
      </Menu>
    )
  });

  renderLayout = () => {
    const { currUser, data } = this.state;
    const { Header, Content, Footer, Sider } = Layout;

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
              {data && this.renderSongs()}
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
            </Sider>
            <Footer style={{ textAlign: 'center' }}>
              MoyBoy аккорды песни гитара подборки
            </Footer>
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
