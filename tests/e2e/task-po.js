var TaskPage = function () {
	this.noteInput = element(by.model('task.note'));
	this.noteTab = element(by.css('[ui-sref="task.default"]'));
	this.locationsTab = element(by.css('[ui-sref="task.locations"]'));
	this.calendarTab = element(by.css('[ui-sref="task.calendar"]'));
	this.backButton = element(by.css('.ion-chevron-left[ui-sref="main-menu.tasks"]'));
};

module.exports = new TaskPage();