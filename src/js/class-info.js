import CLASS_INFO from '../configuration/schedule-file';
import CONFIG from '../configuration/schedule-config';

class ClassInfo {
    constructor(){
        this.WEEKDAY_NUM = 7;
        this.SECTION_NUM = CONFIG.sectionTime.length;
        this.CLASS_INFO = CLASS_INFO;
    }

    getNames() {
        let names = [];
        for (let classList of this.CLASS_INFO) {
            names.push(classList.name);
        }
        return names;
    }

    getClassTable(name, week) {
        const WEEKDAY_NUM = this.WEEKDAY_NUM;
        const SECTION_NUM = this.SECTION_NUM;

        let classTable = [];

        for (let section=0; section<SECTION_NUM; section++) {
            classTable.push([]);
            for (let day=0; day<WEEKDAY_NUM; day++) {
                classTable[section].push({rowspan: 1});
            }
        }

        let classList = this.CLASS_INFO.find(person => person.name === name).classList;

        for (let subject of classList) {

            if (subject.weekRange[0] <= week && week <= subject.weekRange[1]) {

                for (let weekday in subject.time) {
                    let sectionRange = subject.time[weekday].sectionRange;

                    for (let section = sectionRange[0]; section <= sectionRange[1]; section++) {

                        if (section === sectionRange[0]) {

                            classTable[section-1][weekday] = {
                                rowspan: sectionRange[1] - sectionRange[0] + 1,
                                title: subject.title,
                                address: subject.time[weekday].address,
                            };
                        }
                        else
                        {

                            classTable[section-1][weekday] = {
                                rowspan: 0,
                            };
                        }
                    }
                }
            }
        }

        return classTable;
    }

    getAllTable(week) {
        const names = this.getNames();
        const WEEKDAY_NUM = this.WEEKDAY_NUM;
        const SECTION_NUM = this.SECTION_NUM;
        const tables = names.map(name => this.getClassTable(name, week));

        const allTable = tables.reduce((t1, t2) => mergeTable(t1, t2));

        function mergeTable(t1, t2) {
            for (let j=0; j<WEEKDAY_NUM; j++) {
                for (let i=0; i<SECTION_NUM; i++) {
                    if (t2[i][j].rowspan === 0) {
                        if (t1[i][j].rowspan <= 1) {
                            t1[i][j] = t2[i][j];
                        }
                        else {
                            for (let k=1;;k++) {
                                if (t1[i-k][j].rowspan > 0) {
                                    t1[i-k][j] = {
                                        rowspan: Math.max(t1[i-k][j].rowspan, t1[i][j].rowspan+k),
                                        title: t1[i][j].title + '; ' + t1[i-k][j].title,
                                        address: t1[i][j].address + '; ' + t1[i-k][j].address,
                                    };
                                    t1[i][j] = {
                                        rowspan: 0,
                                    };
                                    break;
                                }
                            }
                        }
                    }
                    else if (t2[i][j].rowspan > 1) {
                        if (t1[i][j].rowspan === 1) {
                            t1[i][j] = t2[i][j];
                        }
                        else {
                            for (let k=0;;k++) {
                                if (t1[i-k][j].rowspan > 0) {
                                    t1[i-k][j] = {
                                        rowspan: Math.max(t1[i-k][j].rowspan, t2[i][j].rowspan+k),
                                        title: t1[i-k][j].title + (t1[i-k][j].title.includes(t2[i][j].title) ? '' : ('; ' + t2[i][j].title)),
                                        address: t1[i-k][j].address + (t1[i-k][j].address.includes(t2[i][j].address) ? '' : ('; ' + t2[i][j].address)),
                                    };
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return t1;
        }

        return allTable;
    }

    getTableWraper(name, week) {
        if (name === 'all') {
            return this.getAllTable(week);
        }
        else {
            return this.getClassTable(name, week);
        }
    }
}


export default ClassInfo;
