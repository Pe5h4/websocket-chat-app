import ReactDOM from 'react-dom';
import React, {Component} from 'react';
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Card, Avatar, Input, Typography } from 'antd';
import 'antd/dist/antd.css';
import './index.css'

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const client = new W3CWebSocket('ws://127.0.0.1:8090');


export default class App extends Component {

	state = {
		userName: '',
		isLoggedIn: false,
		messages: [],
	};

	onButtonClick = (value) => {
		client.send(JSON.stringify({
			type: "message",
			msg: value,
			user: this.state.userName
		}));
		this.setState({searchVal: ''})
	}

	componentDidMount() {
		client.onopen = () => {
			console.log('WebSocket client connected');
		};

		client.onmessage = (message) => {
			const dataFromServer = JSON.parse(message.data);
			console.log('Got reply! >>> ', dataFromServer);
			if (dataFromServer.type === 'message') {
				this.setState((state) =>
					({
						messages: [...state.messages, {msg: dataFromServer.msg, user: dataFromServer.user}]
					})
				);
			}
		};

	}

	render() {
		return (
			<div className="main">
				{this.state.isLoggedIn ?
					<div>
						{/*<button onClick={() => this.onButtonClick("Hey!")}>Send message</button>
						{this.state.messages.map((msg,idx) => <p key={idx}>message: {msg.msg}, user: {msg.user} </p>)}*/}
						<div className="title">
							<Text type='secondary' style={{ fontSize: '36px'}}>My websocket chat</Text>
							<br/>
							<Text type='primary' style={{fontSize: '15px'}}>You are logged as {this.state.userName}</Text>
						</div>
						<div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50}}>
							{this.state.messages.map(message =>
								<Card key={message.msg} style={{width:300, margin: '16px 4px 0 4px', alignSelf: this.state.userName === message.user ? 'flex-end' : 'flex-start'}}>
									<Meta
										avatar={
											<Avatar style={{color: '#f56a00', backgroundColor: '#fde3cf'}}>{message.user[0].toUpperCase()}</Avatar>
										}
										title={message.user}
										description={message.msg}
									/>
								</Card>
							)}
						</div>
						<div className="bottom">
							<Search
								placeholder="input message and send"
								enterButton="Send"
								value={this.state.searchVal}
								size="large"
								onChange={(e) => this.setState({searchVal: e.target.value})}
								onSearch={value => this.onButtonClick(value)}
							/>
						</div>
					</div>
				:
					<div style={{padding: '200px 40px'}}>
						<Search
							placeholder="Add Username"
							enterButton="Login"
							size="large"
							onSearch={value => this.setState({isLoggedIn: true, userName: value})}
						/>
					</div>
				}
			</div>
		)
	}
}

ReactDOM.render(
	<App />, document.getElementById('root')
);