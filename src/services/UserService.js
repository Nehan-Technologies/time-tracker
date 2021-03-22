import axios from 'axios'

export default class UserService {

	BASE_URL = 'http://127.0.0.1:3200/'
	loggedInUser = { id: 1, first_name: 'John', last_name: 'Smith', username: 'jsmith' };

	getProjects() {
		return axios.get(this.BASE_URL + 'users/projects').then(res => res.data.data);
	}

	saveTime(wl) {
		return axios.post(this.BASE_URL + 'users/insertUpdateWorklog', { description: wl.description, recordDate: wl.record_date, projectId: wl.project_id, actualHours: wl.actual_hours }).then(res => res.data.data);
	}

	login(username, password) {
		return axios.get(this.BASE_URL + 'login',).then(res => res.data);
	}
	fetchLoggedInUser() {
		return axios.get(this.BASE_URL + 'me').then(res => res.data.data);
	}
	getLoggedInUser() {
		return this.loggedInUser;
	}


	getColumnFieldFromDate(dt) {
		if (dt == null)
			return '';
		return 'col_' + dt.getFullYear() + '_' + (dt.getMonth() + 1) + '_' + dt.getDate()
	}
	getDateFromColumnField(field) {
		if (field == null)
			return null;
		field = field.replaceAll("_", "-");
		return new Date(field);
	}
	getColumnHeaderFromDate(dt) {
		if (dt == null)
			return '';
		return '' + dt.getDate()
	}

}