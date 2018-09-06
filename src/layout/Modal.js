import React, { Component } from 'react';
import { Modal, Row, Col, Input } from 'antd';

class EditSongModal extends Component {
  state = {
    songName: '',
    artistName: '',
    textChords: '',
  };

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
  
  render() {
    const { isModal, currUser, addSong, handleCancel } = this.props;

    const renderAddForm = () => (
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

    return (
      <Modal
        title={null}
        visible={isModal}
        closable={false}
        onOk={addSong}
        onCancel={handleCancel}
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
        { currUser && renderAddForm() }
      </Modal>
    )
  }
}

export default EditSongModal;
