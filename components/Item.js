import React from 'react';
import parseDate from '../utils/parseDate';

function pad( int ) {
	var string = int.toString();
	if ( string.length < 2 ) {
		return '0' + string;
	}

	return string;
}

function formatDate( datetime ) {
	var ms = parseDate( datetime );
	var date, hours, modHours;
	if ( isNaN( ms ) ) {
		return '';
	}

	date = new Date( ms );
	hours = date.getUTCHours();
	modHours = hours % 12;

	return pad( date.getUTCFullYear() ) + '/' +
		pad( date.getUTCMonth() + 1 ) + '/' +
		pad( date.getUTCDate() ) + ' ' +
		pad( modHours ? modHours : 12 ) + ':' +
		pad( date.getUTCMinutes() ) + ' ' +
		( hours < 12 ? 'AM' : 'PM' );
}

export default class Item extends React.Component {
	handleDelete( event ) {
		event.preventDefault();

		const { item, deleteItem } = this.props;

		deleteItem( item );
	}

	handleCheckboxHolderClick( event ) {
		const { item, markItemAsDone, markItemAsUndone } = this.props;

		if ( item.done ) {
			markItemAsUndone( item );
		} else {
			markItemAsDone( item );
		}
	}

	render() {
		const { item } = this.props;

		return (
			<tr>
				<td className="delete" onClick={this.handleDelete.bind( this )}>×</td>
				<td className="done" onClick={this.handleCheckboxHolderClick.bind( this )}><input type="checkbox" checked={item.done} /></td>
				<td><time dateTime={item.datetime}>{ formatDate( item.datetime ) }</time></td>
				<td><a target="_blank" href={item.url}>{item.title || item.url}</a></td>
			</tr>
		);
	}
}
