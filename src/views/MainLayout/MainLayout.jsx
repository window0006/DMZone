import React, { PropTypes } from 'react';

class MainLayout extends React.Component {
	render() {
		return (
			<div>hello world!
			{
				this.props.children
			}</div>
		);
	}
}

export default MainLayout;
