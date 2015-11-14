import React from 'react';

import Item from './item';

function stringCompare( a, b ) {
	return a.localeCompare( b, undefined, { numeric: true, sensitivity: "base" } );
}

try {
	"foo".localeCompare( "bar", "i" );
} catch ( e ) {
	function stringCompare( a, b ) {
		if ( a < b ) {
			return -1;
		} else if ( a > b ) {
			return 1;
		}
		return 0;
	}
}

export default class ItemList extends React.Component {
	constructor( props ) {
		super( props );

		this.state = {
			sortMethod: "datetime.asc",
		};
	}

	comparator( a, b ) {
		const [ method, directionKey ] = this.state.sortMethod.split( "." );
		let direction = directionKey === "asc" ? 1 : -1;

		switch ( method ) {
		case "title" :
			return direction * stringCompare( a.title, b.title );
		default :
			let aDate = Date.parse( a.datetime );
			let bDate = Date.parse( b.datetime );
			let datetimeDiff;
			if ( isNaN( aDate ) ) {
				datetimeDiff = 1;
			} else if ( isNaN( bDate ) ) {
				datetimeDiff = -1;
			} else {
				datetimeDiff = Date.parse( a.datetime ) - Date.parse( b.datetime );
			}

			if ( ! datetimeDiff ) {
				datetimeDiff = stringCompare( a.title, b.title );
			}

			return direction * datetimeDiff;
		}
	}

	sortList( method, event ) {
		event.preventDefault();

		this.setState( { sortMethod: method } );
	}

	render() {
		const { items, deleteItem, markItemAsDone, markItemAsUndone } = this.props;

		if ( ! items.length ) {
			return <p>No saved videos yet.</p>;
		}

		let sorted = [...items];

		sorted.sort( this.comparator.bind( this ) );

		return (
			<table>
				<thead>
					<tr>
						<th scope="col"></th>
						<th scope="col"></th>
						<th scope="col">Date/Time
							<a href="#"
								className={"datetime.asc" === this.state.sortMethod ? "active" : "" }
								onClick={this.sortList.bind(this, "datetime.asc")}
							>▽</a>
							<a href="#"
								className={"datetime.desc" === this.state.sortMethod ? "active" : "" }
								onClick={this.sortList.bind(this, "datetime.desc")}
							>△</a>
						</th>
						<th scope="col">Video
							<a href="#"
								className={"title.asc" === this.state.sortMethod ? "active" : "" }
								onClick={this.sortList.bind(this, "title.asc")}
							>▽</a>
							<a href="#"
								className={"title.desc" === this.state.sortMethod ? "active" : "" }
								onClick={this.sortList.bind(this, "title.desc")}
							>△</a>
						</th>
					</tr>
				</thead>
				<tbody>
				{ sorted.map( item =>
					<Item
						key={item.url}
						item={item}
						deleteItem={deleteItem}
						markItemAsDone={markItemAsDone}
						markItemAsUndone={markItemAsUndone}
					/>
				) }
				</tbody>
			</table>
		);
	}
}
