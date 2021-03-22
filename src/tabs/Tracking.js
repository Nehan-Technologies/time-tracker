import './Tracking.css';

import React, { Component } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import UserService from '../services/UserService';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import AddUpdateTime from '../dialogs/AddUpdateTime'

class Tracking extends Component {

	userServices = null;
	toast = null;
	constructor(props) {
		super(props);
		this.toast = React.createRef();
		this.state = {
			projects: [],
			projectsLoaded: false,
			monthSelectItems: ["January 2021", "February 2021", "March 2021", "April 2021", "May 2021"],
			selectedMonth: "March 2021",
			columns: [],
			displayBasic: false
		};
	}
	componentDidMount() {
		this.userServices = new UserService();
		this.userServices.getProjects().then(data => this.setState({
			projects: data,
			projectsLoaded: true
		})
		);
	}
	saveChangesHandler() {
		this.userServices.saveTime().then(data => this.showAlert())
	}
	showAlert() {
		this.toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'Changes saved', life: 3000 });
	}
	setSelectedProject(project) {
		let stat = this.state;
		stat['selectedProject'] = project;
		stat['worklog'] = project['worklog'];
		this.setState(stat);
		this.buildWorklog();
	}
	setMonth(month) {
		let stat = this.state;
		stat['selectedMonth'] = month;
		this.setState(stat);
		this.buildWorklog();
	}
	buildWorklog() {
		if (this.state == null || this.state['selectedProject'] == null || this.state['selectedProject'] == undefined) {
			return [];
		}
		let dateSplit = this.state['selectedMonth'].split(' ');
		let startDate = new Date(Date.parse(dateSplit[0] + ' 1, ' + dateSplit[1]));
		let lastDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
		let stat = this.state;
		let newWorkLog = { project_id: this.state['selectedProject'].id, user_id: this.userServices.getLoggedInUser().id };
		let cols = [];
		while (startDate.getTime() <= lastDate.getTime()) {
			let col = { field: this.userServices.getColumnFieldFromDate(startDate), header: this.userServices.getColumnHeaderFromDate(startDate) };
			cols.push(col);
			let wl = null;
			for (let workLogEntry of stat['selectedProject']['worklog']) {
				if (workLogEntry != null && new Date(workLogEntry.record_date).getFullYear() == startDate.getFullYear()
					&& new Date(workLogEntry.record_date).getMonth() == startDate.getMonth()
					&& new Date(workLogEntry.record_date).getDate() == startDate.getDate()) {
					wl = workLogEntry;
					break;
				}
			}
			if (wl == null) {
				newWorkLog['estimate_hours_' + col.field] = 0;
				newWorkLog[col.field] = 0;
			} else {
				newWorkLog['estimate_hours_' + col.field] = wl.estimate_hours;
				newWorkLog[col.field] = wl.actual_hours;
			}
			startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate() + 1);
		}
		stat['columns'] = cols;
		stat['selectedProject']['timelog'] = [newWorkLog];
		this.setState(stat);
	}
	getWorkLogCellBody(rowData, column) {
		return <Button label={'' + rowData[column.field]} className="p-button-secondary p-button-text" tooltip="Click to update" onClick={() => this.clickHandler(rowData[column.field], column.field)} />
	}
	showTimeUpdateDialog(data, column) {
		let stat = this.state;
		stat['displayBasic'] = true;
		stat['selectedDate'] = column;
		this.setState(stat);
	}
	onAddUpdateTimeClose() {
		let stat = this.state;
		stat['displayBasic'] = false;
		this.setState(stat);
	}
	saveHoursCompleteHandler(wl) {
		let stat = this.state;
		stat['displayBasic'] = false;
		let tmpRecDate = this.userServices.getColumnFieldFromDate(wl.record_date);
		for (var propName in stat['selectedProject']['timelog'][0]) {
			if (tmpRecDate == propName) {
				stat['selectedProject']['timelog'][0][propName] = wl.actual_hours;
				break;
			}
		}
		this.setState(stat);
	}
	render() {
		return (
			<div className="mainDiv">
				<Toast ref={this.toast} />
				<Card className="topCard">
					<DataTable value={this.state.projects} selection={this.state.selectedProject} onSelectionChange={e => this.setSelectedProject(e.value)} selectionMode="single" dataKey="id">
						<Column field="name" header="Name"></Column>
						<Column field="description" header="Description"></Column>
						<Column field="allocation" header="Allocation"></Column>
						<Column field="burned" header="Burned till date"></Column>
					</DataTable>
				</Card>
				<Card className="bottomCard">
					<div className="monthSelectionContainer">
						<Dropdown value={this.state.selectedMonth} options={this.state.monthSelectItems} onChange={(e) => this.setMonth(e.value)} placeholder="Select Month" />
					</div>
					<DataTable value={this.state.selectedProject?.timelog}>
						{this.state?.columns?.map((col, i) =>
							<Column key={col.field} field={col.field} header={col.header} clickHandler={this.showTimeUpdateDialog.bind(this)} body={this.getWorkLogCellBody} />
						)}
					</DataTable>
				</Card>
				<Dialog header="Update Time" visible={this.state.displayBasic} onHide={this.onAddUpdateTimeClose.bind(this)} baseZIndex={1000} style={{ width: '30vw' }}>
					<AddUpdateTime selectedProject={this.state.selectedProject} selectedDay={this.state.selectedDate} saveCompleteHandler={this.saveHoursCompleteHandler.bind(this)} />
				</Dialog>
			</div>
		);
	}
}

export default Tracking;
