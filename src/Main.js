import React, { Component } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import Tracking from './tabs/Tracking';
import Review from './tabs/Review';

class Main extends Component {

	constructor(props) {
		super(props);
		this.state = { 'activeIndex': 0, 'setActiveIndex': 0 };
	}
	render() {
		return (
			<TabView activeIndex={this.state.activeIndex} onTabChange={(e) => this.setState({ activeIndex: e.index })}>
				<TabPanel header="Tracking">
					<Tracking />
				</TabPanel>
				<TabPanel header="Review">
					<Review />
				</TabPanel>
			</TabView>
		);
	}
}

export default Main;