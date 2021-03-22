import React, { Component } from 'react';
import UserService from '../services/UserService';
import { Button } from 'primereact/button';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';

class AddUpdateTime extends Component {

	userService = null
	constructor(props) {
		super(props);
		this.state = {
			actual: 0,
			forecast: 0
		};
		this.userService = new UserService();
	}
	componentDidMount() {


		this.setState({
			actual: this.props.selectedProject['timelog'][0][this.props.selectedDay],
			forecast: this.props.selectedProject['timelog'][0]['estimate_hours_' + this.props.selectedDay],
			recordDate: this.userService.getDateFromColumnField(this.props.selectedDay)
		});

	}
	setValue(event) {
		this.state.actual = event.value;
	}
	setDescription(event) {
		this.state.description = event.target.value;
	}
	saveChangesHandler() {
		let wl = { description: '', record_date: this.state.recordDate, project_id: this.props.selectedProject.id, actual_hours: this.state.actual };
		this.userService.saveTime(wl).then(data => this.props.saveCompleteHandler(wl));
	}
	render() {
		return (
			<div className="addUpdateTimeMainDiv">
				<div className="p-grid">
					<div className="p-col-4">Project:</div>
					<div className="p-col-8">{this.props.selectedProject.name}</div>
				</div>
				<div className="p-grid">
					<div className="p-col-4">Estimate: </div>
					<div className="p-col-8"><InputNumber value={this.state.forecast} disabled={true} max={24} style={{ width: '2rem' }} size={3} /></div>
				</div>
				<div className="p-grid">
					<div className="p-col-4">Actual Worked:</div>
					<div className="p-col-8"><InputNumber value={this.state.actual} onValueChange={this.setValue.bind(this)} max={24} style={{ width: '2rem' }} size={3} /></div>
				</div>
				<div className="p-grid">
					<div className="p-col-4">Description:</div>
					<div className="p-col-8"><InputTextarea rows={3} cols={45} value={this.state.description} onChange={this.setDescription.bind(this)} /></div>
				</div>
				<div className="addUpdateTimeButtonBar">
					<Button label="Save" className="reviewSaveButtonStyle" onClick={this.saveChangesHandler.bind(this)} />
				</div>
			</div>
		);
	}
}

export default AddUpdateTime;
