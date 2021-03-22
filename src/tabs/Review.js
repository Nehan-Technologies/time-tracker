import './Review.css';
import React, { Component } from 'react';
import UserService from '../services/UserService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

class Review extends Component {

	constructor(props) {
		super(props);
		this.state = {
			projects: [],
			projectsLoaded: false
		};
	}
	componentDidMount() {
		let userService = new UserService();
		userService.getProjects().then(data => this.setState({
			projects: data,
			projectsLoaded: true
		})
		);
	}
	saveChangesHandler() {
		alert('Not implemented yet!');
	}
	render() {
		return (
			<div className="reviewMainDiv">
				<Card className="reviewTopCard">
					<p> Add some grid, charts and all here </p>
				</Card>
				<div className="reviewButtonBar">
					<Button label="Save" className="reviewSaveButtonStyle" onClick={this.saveChangesHandler} />
				</div>
			</div>
		);
	}
}

export default Review;
