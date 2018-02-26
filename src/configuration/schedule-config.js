const CONFIG = {
    firstSemesterDay: '2018-02-25', // first day of your semester, begining of the first week
    totalWeek: 18, // total weeks of the semester
    sectionTime: [ // time range of each class
        ['08:00', '08:45'],
        ['08:50', '09:35'],
        ['09:50', '10:35'],
        ['10:40', '11:25'],
        ['11:30', '12:15'],
        ['14:05', '14:50'],
        ['14:55', '15:40'],
        ['15:45', '16:30'],
        ['16:40', '17:25'],
        ['17:30', '18:15'],
        ['18:30', '19:15'],
        ['19:20', '20:05'],
        ['20:10', '20:55'],
    ],
    amRange: [1, 5], // class sections in the morning
    pmRange: [6, 10], // class sections in the afternoon, after pm range is night classes, not necessary to config it
}

export default CONFIG;
