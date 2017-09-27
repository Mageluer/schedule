import CONFIG from '../configuration/schedule-config';

class DateTool {
    getCurrentWeekNum() {
        const FIRST_SEMESTER_DAY = new Date(CONFIG.firstSemesterDay);
        const d = new Date();
        const currentWeekNum = Math.ceil((d.getTime() - FIRST_SEMESTER_DAY.getTime()) / (7 * 24 * 3600 * 1000))
        return currentWeekNum;
    }

    getCurrentWeek(weekNum) {
        const WEEK_DAY_NAME = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const FIRST_SEMESTER_DAY = new Date(CONFIG.firstSemesterDay);
        let cd = new Date(FIRST_SEMESTER_DAY.getTime() + (weekNum - 1) * (7 * 24 * 3600 * 1000));
        let currentWeek = [];
        for (let i=0; i<7; i++) {
            currentWeek.push(
                {
                    name: WEEK_DAY_NAME[i],
                    date: cd.getMonth() + 1 + '.' + cd.getDate(),
                }
            );
            cd = new Date(cd.getTime() + 24 * 3600 * 1000);
        }
        return currentWeek;
    }

    getSectionTime() {
        const sectionTime = CONFIG.sectionTime;
        return sectionTime;
    }

    decorateTable(table) {
        const AM_SEP = CONFIG.amRange[1];
        const PM_SEP = CONFIG.pmRange[1];
        const TOTAL_SECTION = CONFIG.sectionTime.length;
        const AM_COLOR = 'rgba-cyan';
        const PM_COLOR = 'rgba-orange';
        const NT_COLOR = 'rgba-stylish';
        const HOVER_EFF = 'hoverable';
        const H_ALIGN = 'text-center';
        const V_ALIGN = 'align-middle';
        const weekday = (new Date()).getDay();

        for (let i=0; i<TOTAL_SECTION; i++) {
            for (let j=0; j<7; j++) {
                table[i][j].classnames = [];
                if (table[i][j].rowspan > 1) {
                    table[i][j].classnames.push(H_ALIGN);
                    table[i][j].classnames.push(V_ALIGN);
                    table[i][j].classnames.push(HOVER_EFF);
                }
                if (i < AM_SEP) {
                    let suffix = j === weekday ? '-strong' : '-light';
                    table[i][j].classnames.push(AM_COLOR + suffix);
                }
                else if (i < PM_SEP) {
                    let suffix = j === weekday ? '-strong' : '-light';
                    table[i][j].classnames.push(PM_COLOR + suffix);
                }
                else {
                    let suffix = j === weekday ? '-strong' : '-light';
                    table[i][j].classnames.push(NT_COLOR + suffix);
                }
            }
        }

        return table;
    }
}

export default DateTool;
