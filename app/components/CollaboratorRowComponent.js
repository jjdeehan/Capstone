import React from 'react'
import events from '../utils/events'
import io from 'socket.io-client'
import Promise from 'bluebird'

import { serverLocation } from '../utils/server.settings.js'
const socket = io(serverLocation)

export default class extends React.Component{

    constructor(props){
        super(props);

        this.state = {
            repoId: this.props.repoId,
            clickToGoHome: this.props.clickToGoHome,
            collaborator: this.props.collaborator,
            goToPairRoom: this.props.goToPairRoom,
            myName: this.props.myName,
            myId: this.props.myId,
            MediaStreamURL: this.props.URL,
            incomingCall: this.props.incomingCall,
            sortOutMedia: this.props.sortOutMedia
        }

        this.callCollaborator = this.callCollaborator.bind(this)
        this.handleIncomingCall = this.handleIncomingCall.bind(this)
        this.streamSuccessHandler = this.streamSuccessHandler.bind(this)
        this.setUserMedia = this.setUserMedia.bind(this)
        this.setLocalUserMedia = this.setLocalUserMedia.bind(this)
        this.localVideoView = this.localVideoView.bind(this)

    }


    callCollaborator() {
        socket.emit('Pair with me', {
            room: this.state.repoId,
            name: this.state.collaborator.name,
            url: `/${this.state.myName}`
        })

        var settingLocalMedia = Promise.promisify(this.setUserMedia)

        this.props.setPairingRoomURL(`/${this.state.myName}`)
        Promise.resolve(this.setLocalUserMedia())
        .then(() => this.setUserMedia())
        .then(() => {
            return setTimeout(() => {


                this.props.sortOutMedia()
                return this.props.clickToGoHome()
            }, 3000)
        })
        .catch(console.error)

    }

    handleIncomingCall() {
        Promise.resolve(this.setLocalUserMedia())
        .then(() => this.setUserMedia())
        .then(() => {
            return setTimeout(() => {
                this.props.clickToGoHome()
                return this.props.sortOutMedia()
            }, 3000)
        })
        .then(() => {
            return setTimeout(() => {
                return events.trigger('startCall', this.state.collaborator)
            }, 3000)
        })
        .catch(console.error)

    } 

    setLocalUserMedia() {
        return navigator.getUserMedia(
            {
                video:true,
                audio:false,
            },
            this.localVideoView,
            console.error
        )
    }

    setUserMedia() {
        return navigator.getUserMedia(
            {
                video:true,
                audio:true,
            },
            this.streamSuccessHandler,
            console.error
        )
    }

    streamSuccessHandler(stream) {
        return this.props.UpdateStream(stream);
    }

    localVideoView(stream) {
        return this.props.UpdateLocalStream(stream);
    }


    render(){
        return (
        <div>
            <div key={this.state.collaborator} onClick={this.callCollaborator}>{this.state.collaborator.name}</div>
            {
                this.props.incomingCall && <button onClick={ this.handleIncomingCall}>Answer, begin pair</button>
            }
        </div>
        )
    }
}