import React, { Component } from 'react';
import { Modal, Row, Col, Input } from 'antd';
import styles from './styles.scss';

class EditSongModal extends Component {
  state = {
    songName: '',
    artistName: '',
    textChords: '',
  };

  componentDidMount(){
    if(this.props.isEditSongMode) {
      const editingSong = this.props.editingSong;
      this.setState({
        ...editingSong
      })
    }
  }

  onChangeSongName = ({ target }) => {
    this.setState({songName: target.value})
  }
  
  onChangeArtistName = ({ target }) => {
    this.setState({artistName: target.value})
  }

  onChangeTextChord = ({ target }) => {
    this.setState({textChords: target.value})
  }
  
  renderAddForm = () => {
    const {artistName, songName, textChords} = this.state;

    return (
      <Row>
        <Col span={12}>
          <Row style={{padding: '10px 0'}}>
            <Input placeholder="Artist" value={artistName} onChange={this.onChangeArtistName} style={{ height: 20 }}/> 
          </Row>
          <Row style={{padding: '10px 0'}}>
            <Input placeholder="Song name" value={songName} onChange={this.onChangeSongName} style={{ height: 20 }}/> 
          </Row>
          <Row style={{padding: '10px 0'}}>
            <Input.TextArea placeholder="Text" value={textChords} onChange={this.onChangeTextChord} autosize/> 
          </Row>
        </Col>
      </Row>
    );
  }

  render() {
    const { isModal, currUser, onAddSong, onModalCancel } = this.props;
    return (
      <Modal
        title={null}
        visible={isModal}
        closable={false}
        onOk={() => onAddSong(this.state)}
        onCancel={onModalCancel}
        okText="Обновить"
        className={styles.modal}
        getContainer={() => document.getElementById('root')}
      >
        { currUser && this.renderAddForm() }
      </Modal>
    )
  }
}

export default EditSongModal;
