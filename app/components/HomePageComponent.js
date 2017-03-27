
// @flow
import React, { Component } from 'react';
import TextEditorContainer from '../containers/TextEditorContainer';
import FilesContainer from '../containers/FilesContainer'
import FileListComponent from '../components/FileListComponent'
import GitButtonsContainer from '../containers/GitButtonsContainer';
import ErrorBoxContainer from '../containers/ErrorBoxContainer';
import SuccessBoxContainer from '../containers/SuccessBoxContainer';
import{ serverLocation }from '../utils/server.settings'
import io from 'socket.io-client'

const socket = io(serverLocation)

export default class HomePageComponent extends Component {

  constructor(props){
    super(props)
    this.state = {
      remoteVideoRendered: false,
    }
    this.setSelfToDriver = this.setSelfToDriver.bind(this)
    this.setPartnerToDriver = this.setPartnerToDriver.bind(this)

    socket.on('partner picked self as driver', () => {
      this.props.setDriverToPartner()
    })

    socket.on('partner picked you as driver', () => {
      this.props.setDriverToMyself()
    })

    this.returnToCollaborators = this.returnToCollaborators.bind(this);

    socket.on('peer connection severed', () => {
          URL.revokeObjectURL(this.props.URL);
          URL.revokeObjectURL(this.props.remoteURL)
    })

  }

  componentDidMount(){
    const LocalVideo = document.getElementById('localWebchat')
    LocalVideo.src = URL.createObjectURL(this.props.localURL);
    LocalVideo.play();
    setTimeout(()=>{
      socket.emit('room', {room: this.props.room,})
    }, 0)
  }

  setSelfToDriver(){
    this.props.setDriverToMyself()
    socket.emit('driver selected', {room: this.props.room})
  }

  setPartnerToDriver(){
    this.props.setDriverToPartner()
    socket.emit('navigator selected', {room: this.props.room})
  }

  componentDidUpdate(){
    if (this.props.remoteURL.length && this.state.remoteVideoRendered === false){
      const RemoteVideo = document.getElementById('webchatWindow');
        this.setState({remoteVideoRendered: true});
        RemoteVideo.src = this.props.remoteURL;
        RemoteVideo.play();

    }
  }

  returnToCollaborators() {
    this.props.backToCollaborators();
    this.props.makeAvailable(this.props.myName)
    this.props.clearRole()
    socket.emit('closed connection', {room: this.props.room})
    socket.emit('set available', { room: this.props.repoId, name: this.props.myName })
    URL.revokeObjectURL(this.props.remoteURL)
    this.props.localURL.getVideoTracks()[0].stop();
    this.props.URL.getVideoTracks()[0].stop();
    this.props.URL.getAudioTracks()[0].stop();
    this.props.clearURLs();
    this.setState({remoteVideoRendered: false});
  }

  componentWillUnmount() {
    window.pc.close();
    window.pc = null;
  }

  render() {
    return (
      //NO ROLES DEFINED
      <div>
        <video id="webchatWindow" onClick={this.setPartnerToDriver} />
        <video id="localWebchat" onClick={this.setSelfToDriver} />
        <button onClick={this.returnToCollaborators}>BACK TO COLLABS</button>
        {(this.props.role === '') ?
            <div>
              <h1>Who is driving?</h1>
              <p>Click the video to choose.</p>
            </div>
        :
      //DRIVER VIEW
        (this.props.role === 'driver') ?
            <div>
              <FilesContainer />
              <TextEditorContainer />
              <GitButtonsContainer />
              <ErrorBoxContainer />
              <SuccessBoxContainer />
            </div>
        :
      //NAVIGATOR VIEW
            <div>
              <TextEditorContainer />
              <FileListComponent/>
            </div>
      }
      </div>
    )
    }
}
