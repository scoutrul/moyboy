import React, { Component } from 'react';
import { Modal, Row, Col, Input } from 'antd';
import styles from './styles.scss';

class EditSongModal extends Component {
  state = {
    songName: '',
    artistName: '',
    textChords: '',
  };

  onChangeSongName = ({ target }) => {
    this.setState({songName: target.value})
  }
  
  onChangeArtistName = ({ target }) => {
    this.setState({artistName: target.value})
  }

  onChangeTextChord = ({ target }) => {
    this.setState({textChords: target.value})
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
        className={styles.modal}
        getContainer={() => document.getElementById('root')}
      >
        { currUser && renderAddForm() }
      </Modal>
    )
  }
}

export default EditSongModal;
