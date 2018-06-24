import React from 'react';
import { Route } from 'react-router-dom';
import Home from 'views/Home';
import List from 'views/List';
import Detail from 'views/Detail';

import Header from 'modules/Header';
import Footer from 'modules/Footer';
import Editor from 'modules/Editor';
import MediaEditor from 'modules/Editor/MediaEditor';
import ColorEditor from 'modules/Editor/ColorEditor';

class MainLayout extends React.Component {
	renderMainByRoute() {
		return [
			<Route exact key="/" path="/" component={Home} />,
			<Route key="list" path="/list" component={List} />,
			<Route key="detail" path="/detail" component={Detail} />
		];
	}
	render() {
		return (
			<div>
				<Header />
				{
					this.renderMainByRoute()
				}
				<Editor />
				<MediaEditor />
				<ColorEditor />
				<Footer />
			</div>
		);
	}
}

export default MainLayout;
