var tasks = require('../fixtures/fixtures.js').tasks;
var ptor = protractor.getInstance();

var TaskListPage = function () {
    this.tasksDiv = element(by.id('taskList'));
    this.tasks = element.all(by.repeater('task in tasks'));
    this.searchInput = element(by.id('searchInput'));
    this.searchButton = element(by.css('[ng-click="search()"]'));
    this.searchCancelButton = element(by.css('[ng-click="cancelSearch()"]'));
    this.cancelSelectionsButton = element(by.css('[ng-click="cancelSelections()"]'));
    this.markSelectedTasksAsDoneButton = element(by.css('[ng-click="markSelectedTasksAsDone()"]'));
    this.editSelectedTaskButton = element(by.css('[ng-click="editSelectedTask()"]'));
    this.removeSelectedTasksButton = element(by.css('[ng-click="removeSelectedTasks()"]'));
    this.addTaskButton = element(by.css('[ng-click="addNewTask()"]'));

    this.open = function () {
        return browser.get('/#');
    };

    this.loadSampleData = function () {
        return browser.executeAsyncScript(function (callback) {
            var taskService = angular.element(document).injector().get('taskService');
            var fixtures = angular.element(document).injector().get('fixtures');
            fixtures.tasks.forEach(function (task) {
                taskService.addIfNotAdded(task);
            });
            taskService.saveChanges();
            callback();
        }).then(function (output) {
            ptor.sleep(1000);
        });
    };

    this.holdItem = function (index) {
        var el = this.tasks.get(index);
        ptor.actions().mouseDown(el).perform();
        ptor.sleep(700);
        ptor.actions().mouseUp().perform();
    };

    this.clickItem = function (index) {
        this.tasks.get(index).click();
    };

    this.isSelectionMode = function () {
        return this.cancelSelectionsButton.isPresent();
    };

    this.isSearchMode = function () {
        return this.searchInput.isPresent();
    };
};

module.exports = new TaskListPage();
