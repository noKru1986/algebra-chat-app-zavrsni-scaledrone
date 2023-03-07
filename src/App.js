import React, { Component } from 'react';
import './App.css';
import Messages from './Messages';
import Input from './input';
// funkcija sa kojom dodjeljujemo random imena
function randomName() {
    const firstName = [
        'Kruno',
        'Iva',
        'Zrinka',
        'Marko',
        'Damir',
        'Lovro',
        'Luka',
        'Marina',
        'Martina',
        'Nela',
        'Ivan',
        'Valentino',
        'Zvonimir',
    ];
    const lastName = [
        'Blažičević',
        'Lovrić',
        'Babić',
        'Janković',
        'Petrić',
        'Paponja',
        'Beljak',
        'Stupar',
        'Kovač',
        'Vlašić',
        'Mandžukić',
        'Raić',
        'Boban',
    ];

    const firstNames = firstName[Math.floor(Math.random() * firstName.length)];
    const lastNames = lastName[Math.floor(Math.random() * lastName.length)];
    return firstNames + ' ' + lastNames;
}
// funkcija sa kojom dodjeljujemo random boju
function randomColor() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
}
class App extends Component {
    constructor() {
        super();
        this.state = {
            messages: [],
            member: {
                username: randomName(),
                color: randomColor(),
            },
        };

        this.drone = new window.Scaledrone('YuGu4CDH1ZbqsCbu', {
            data: this.state.member,
        });
    }

    componentDidMount() {
        this.drone.on('open', (error) => {
            if (error) {
                return console.error(error);
            }
            const member = { ...this.state.member };
            member.id = this.drone.clientId;
            this.setState({ member });
        });
        const room = this.drone.subscribe('observable-room');
        room.on('data', (data, member) => {
            const messages = this.state.messages;
            messages.push({ member, text: data });
            this.setState({ messages });
        });
    }

    onSendMessage = (message) => {
        if (message === '') {
            alert('Unesi svoju poruku!!!');
        } else {
            this.drone.publish({
                room: 'observable-room',
                message,
            });
        }
    };

    render() {
        return (
            <div className="App">
                <div className="App-header">
                    <h1 className="animate-charcter">
                        Algebra Chat Aplikacija
                    </h1>
                </div>
                <div className="App-cross"></div>
                <Messages
                    messages={this.state.messages}
                    currentMember={this.state.member}
                />
                <Input onSendMessage={this.onSendMessage} />
            </div>
        );
    }
}

export default App;
