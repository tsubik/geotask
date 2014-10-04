var MainMenu = function () {
	this.allTasksLink = element(by.css('[ui-sref="main-menu.tasks"]'));
	this.nearbyTasksLink = element(by.css('[ui-sref="main-menu.nearby-tasks"]'));
	this.doneTasksLink = element(by.css('[ui-sref="main-menu.done-tasks"]'));
	this.locationsLink = element(by.css('[ui-sref="main-menu.locations"]'));
	this.settingsLink = element(by.css('[ui-sref="main-menu.settings"]'));
	this.toggleButton = element(by.xpath('//button[i/@class = "icon ion-navicon"]'));
};

module.exports = new MainMenu();