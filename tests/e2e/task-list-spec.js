describe('E2E: task list page', function () {
    var ptor,
        taskListPage = require('./task-list-po.js'),
        taskPage = require('./task-po.js');

    it('Initialization', function () {
        ptor = protractor.getInstance();
        taskListPage.open()
            .then(taskListPage.loadSampleData)
            .then(taskListPage.open);
    });

    describe('Tests', function () {
        it('should load the page', function () {
            console.log('starting should load the page');
            expect(taskListPage.tasksDiv).toBeDefined();
            expect(taskListPage.tasks.count()).toBe(3);
        });

        describe('searchMode', function () {
            it('should work', function () {
                taskListPage.searchButton.click();
                expect(taskListPage.isSearchMode()).toBe(true);
            });

            it('filtering should works', function () {
                expect(taskListPage.tasks.count()).toBe(3);
                taskListPage.searchInput.sendKeys('blog');
                expect(taskListPage.tasks.count()).toBe(1);
            });

            it('should exit mode after cancel click', function () {
                taskListPage.searchCancelButton.click();
                expect(taskListPage.isSearchMode()).toBe(false);
            });
        });

        describe('selectionMode', function () {
            it('should enter select mode on holding item', function () {
                expect(taskListPage.isSelectionMode()).toBe(false);
                taskListPage.holdItem(0);
                expect(taskListPage.isSelectionMode()).toBe(true);
            });

            it('should have done, edit, remove buttons if only one item selected', function () {
                expect(taskListPage.markSelectedTasksAsDoneButton.isPresent()).toBe(true);
                expect(taskListPage.editSelectedTaskButton.isPresent()).toBe(true);
                expect(taskListPage.removeSelectedTasksButton.isPresent()).toBe(true);
            });

            it('should select another item on click', function () {
                taskListPage.clickItem(1);
                expect(taskListPage.tasks.get(1).getAttribute('class')).toContain('selected');
            });

            it('should have only done, remove buttons if more than item selected', function () {
                expect(taskListPage.markSelectedTasksAsDoneButton.isPresent()).toBe(true);
                expect(taskListPage.editSelectedTaskButton.isPresent()).toBe(false);
                expect(taskListPage.removeSelectedTasksButton.isPresent()).toBe(true);
            });
        });

        describe('Item manipulations', function () {
            it('should remove selected items', function () {
                taskListPage.open();
                ptor.waitForAngular();
                taskListPage.holdItem(0);
                taskListPage.clickItem(1);
                taskListPage.removeSelectedTasksButton.click();
                expect(taskListPage.isSelectionMode()).toBe(false);
                expect(taskListPage.tasks.count()).toBe(1);
            });

            it('should mark as done selected items', function () {
                taskListPage.loadSampleData();
                taskListPage.open();
                taskListPage.holdItem(0);
                taskListPage.clickItem(1);
                taskListPage.markSelectedTasksAsDoneButton.click();
                expect(taskListPage.tasks.count()).toBe(1);
            });
        });

        describe('Task adding/editing', function () {
            it('should not add task without notes', function () {
                var taskCount;
                taskListPage.open();
                taskCount = taskListPage.tasks.count();
                taskListPage.addTaskButton.click();
                taskPage.backButton.click();
                expect(taskListPage.tasks.count()).toBe(taskCount);
            });

            it('should add task with notes', function () {
                taskListPage.open();
                taskListPage.addTaskButton.click();
                taskPage.noteInput.sendKeys('This is a new task');
                taskPage.backButton.click();
                expect(taskListPage.tasks.getText()).toContain('This is a new task');
                //taskListPage.tasks.locator().column('{{task.note}}')
            });
        });
    });
});
