describe('E2E: task list page', function () {
    var ptor;
    var taskList = element(by.id('taskList'));
    var searchInput = element(by.id('searchInput'));
    var searchButton = element(by.css('[ng-click="search()"]'));
    var searchCancelButton = element(by.css('[ng-click="cancelSearch()"]'));

    beforeEach(function () {
        ptor = protractor.getInstance();
        ptor.get('#/');
    });

    it('should load the page', function () {
    	expect(taskList.isPresent()).toBe(true);
    });

    describe('searchMode', function () {
    	beforeEach(function () {
    		searchButton.click();
    	});

    	it('should work', function () {
    		expect(searchInput.isPresent()).toBe(true);
    	});

    	it('should exit mode after cancel click', function () {
    		searchCancelButton.click();
    		expect(searchInput.isPresent()).toBe(false);
    	});
    });
});
