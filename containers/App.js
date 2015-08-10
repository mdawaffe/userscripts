import React from 'react';
import { Provider } from 'redux/react';

import UserScriptDataApp from './UserScriptDataApp';

export default function( redux ) {
	return class App extends React.Component {
		render() {
			const { authorize } = this.props;

			return (
				<Provider redux={redux}>
					{ () => <UserScriptDataApp authorize={authorize} /> }
				</Provider>
			);
		}
	};
}
