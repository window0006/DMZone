import React from 'react';
import ReactDOM from 'react-dom';
// import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';
// import { syncHistoryWithStore } from 'react-router-redux';

import MainLayout from 'views/MainLayout';

// const history = syncHistoryWithStore(browserHistory, store);

ReactDOM.render(
	<Router>
		<MainLayout />
	</Router>,
	document.querySelector('#app')
);
