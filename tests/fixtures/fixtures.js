var Fixtures = function () {
    this.locations = [{
        id: '1',
        name: 'Gliwice city center',
        coords: {
            latitude: 50.2939,
            longitude: 18.6672
        }
    }, {
        id: '2',
        name: 'Gliwice main station',
        coords: {
            latitude: 50.300320,
            longitude: 18.675302
        }
    }, {
        id: '3',
        name: 'Gliwice Central Europe mall',
        coords: {
            latitude: 50.265987,
            longitude: 18.720406
        }
    }];

    this.tasks = [{
        id: '1',
        note: 'Go for some shopping',
        locationReminders: [{
                id: '1',
                location: this.locations[2],
                whenIgetCloser: true,
                radius: 2000
            }]
            //repetition: taskRepetitionService.createNew(repetitionFrequency.DAILY)
    }, {
        id: '2',
        note: 'Write blog post',
        //repetition: taskRepetitionService.createNew(repetitionFrequency.DAILY)
    }, {
        id: '3',
        note: 'Remember to check new restaurant',
        locationReminders: [{
                id: '1',
                location: this.locations[0],
                whenIgetCloser: true,
                radius: 2000
            }]
            //repetition: taskRepetitionService.createNew(repetitionFrequency.DAILY)
    }];
};

module.exports = new Fixtures();
