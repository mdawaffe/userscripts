import React from 'react';

export default class CollaboratorsCount extends React.Component {
	render() {
		const { collaborators } = this.props;

		return (
			<p id="collaborators">{"Viewers: " + collaborators.toString()}</p>
		);
	}
}
