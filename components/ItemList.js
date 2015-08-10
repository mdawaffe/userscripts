import React from 'react';

import Item from './item';

export default class ItemList extends React.Component {
	render() {
		const { items, deleteItem, markItemAsDone, markItemAsUndone } = this.props;

		if ( ! items.length ) {
			return <p>No saved videos yet.</p>;
		}

		return (
			<table>
				<thead>
					<tr>
						<th scope="col"></th>
						<th scope="col"></th>
						<th scope="col">Date/Time</th>
						<th scope="col">Video</th>
					</tr>
				</thead>
				<tbody>
				{ items.map( item =>
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
