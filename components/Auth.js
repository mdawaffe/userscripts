import React from 'react';

export default class Auth extends React.Component {
	handleClick( event ) {
		event.preventDefault();

		const { authorize } = this.props;

		authorize();
	}

	render() {
		return <button onClick={this.handleClick.bind(this)}>Authenticate</button>;
	}
}
