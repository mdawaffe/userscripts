import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'redux/react';

import { PHASE_LOADING } from '../constants';

import * as actions from '../actions';

import Auth from '../components/Auth';
import ItemForm from '../components/ItemForm';
import ItemList from '../components/ItemList';

@connect( state => ( {
	items: state.items,
	user: state.user,
	phase: state.phase,
} ) )
export default class UserScriptDataApp extends React.Component {
	render() {
		const { items, user, phase, dispatch, authorize } = this.props;

		switch ( phase ) {
		case PHASE_LOADING :
			return <p>Loading…</p>;
		}

		if ( ! user ) {
			return <Auth authorize={authorize} {...bindActionCreators( actions, dispatch )} />;
		}

		return (
			<div>
				<ItemForm {...bindActionCreators( actions, dispatch )} />
				<ItemList items={items} {...bindActionCreators( actions, dispatch )} />
			</div>
		);
	}
}
