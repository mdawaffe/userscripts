import React from 'react';

export default class ItemForm extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			active: false
		};
	}

	handleFormSubmit( event ) {
		const { addItem } = this.props;

		event.preventDefault();

		addItem( {
			done: false,
			datetime: event.target.datetime.value,
			title: event.target.title.value,
			url: event.target.url.value
		} );

		event.target.reset();
	}

	handleButtonClick( event ) {
		event.preventDefault();

		this.setState( { active: true } );
	}

	render() {
		if ( this.state.active ) {
			return this.renderForm();
		} else {
			return this.renderButton();
		}
	}

	renderForm() {
		return (
			<form onSubmit={this.handleFormSubmit.bind( this )}>
				<table>
					<tr>
						<th scope="row"><label htmlFor="datetime">Date/Time</label></th>
						<td><input id="datetime" name="datetime" type="datetime-local" /></td>
					</tr>
					<tr>
						<th scope="row"><label htmlFor="title">Title</label></th>
						<td><input id="title" name="title" type="text" /></td>
					</tr>
					<tr>
						<th scope="row"><label htmlFor="url">URL</label></th>
						<td><input id="url" name="url" type="url" /></td>
					</tr>
				</table>
				<p>
					<input type="submit" value="Add" />
				</p>
			</form>
		);
	}

	renderButton() {
		return (
			<button onClick={this.handleButtonClick.bind(this)}>Add Item</button>
		);
	}
}
