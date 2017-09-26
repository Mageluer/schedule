import React from 'react';
import ReactDOM from 'react-dom';
import ClassInfo from './class-info';
import ReactTooltip from 'react-tooltip'
import './css/bootstrap.min.css'
import './css/mdb.min.css'
import './css/index.css'

const ci = new ClassInfo();

function Lesson(props) {
    const rowspan = props.rowspan;
    const classnames = props.classnames;
    if (rowspan > 1) {
        return (
            <td rowSpan={rowspan} data-tip={props.address} className={classnames.join(' ')}>
                {props.title}
            </td>
        );
    }
    else if (rowspan === 1) {
        return (
            <td className={classnames.join(' ')}></td>
        );
    }
    else {
        return null;
    }
}

class SchduleTable extends React.Component {
    renderLesson(lesson) {
        const [i, j] = lesson;
        return (
            <Lesson
                key = {[i,j]}
                rowspan={this.props.lessons[i][j].rowspan}
                title={this.props.lessons[i][j].title}
                address={this.props.lessons[i][j].address}
                classnames={this.props.lessons[i][j].classnames}
            />
        );
    }

    generateThead() {
        const currentWeekNum = this.props.currentWeekNum;
        const currentWeek = this.props.currentWeek;
        const wd = (new Date()).getDay();
        const thead = (
            <thead className="special-color white-text">
                <tr>
                    <th className='unique-color-dark text-center'>Week:{currentWeekNum}</th>
                    {currentWeek.map(
                        (weekday, i) =>
                            <th key={i} data-tip={weekday.date} className={wd===i ? 'special-color-dark text-center' : 'text-center'}>
                                {weekday.name}
                            </th>
                    )}
                </tr>
            </thead>
        );
        return thead;
    }

    generateTbody() {
        const lessons = this.props.lessons;
        const sectionTime = getSectionTime();
        const d = new Date();
        const currentHour = d.getHours();
        const currentMin = d.getMinutes();
        const tbody =
            (
                <tbody>
                {lessons.map(
                        (row, i) =>
                            <tr key={i}>
                                <th scope="row" className={'white-text text-center' + ((parseInt(sectionTime[i][0].split(':')[0], 10)*60+parseInt(sectionTime[i][0].split(':')[1], 10) <= currentHour*60+currentMin && currentHour*60+currentMin <= parseInt(sectionTime[i][1].split(':')[0], 10)*60+parseInt(sectionTime[i][1].split(':')[1], 10)) ? ' elegant-color' : ' stylish-color')} data-tip={sectionTime[i].join('-')}>
                                    {i+1}
                                </th>
                                {row.map(
                                    (col, j) =>
                                        this.renderLesson([i,j])
                                )}
                            </tr>
                )}
                </tbody>
            );
        return tbody;
    }

    render() {
        const thead = this.generateThead();
        const tbody = this.generateTbody();
        return (
            <table className="table table-hover table-responsive table-fixed table-bordered">
                {thead}
                {tbody}
            </table>
        );
    }
}

class NameButton extends React.Component {
    renderButton(name, week, currentName) {
        const C_COLOR = 'btn btn-primary waves-effect waves-light list-inline-item';
        const U_COLOR = 'btn btn-secondary waves-effect waves-light list-inline-item';
        return (
            <li key={name} className={name===currentName ? C_COLOR : U_COLOR} onClick={() => this.props.onClick(name, week)}>
                {name}
            </li>
        );
    }
    generateButtons() {
        const week = this.props.currentWeekNum;
        const currentName = this.props.name;
        let names = ci.getNames();
        names.unshift('all');
        const namebtns = (
            <ul className="list-inline">
                {names.map(
                    (name) =>
                        this.renderButton(name, week, currentName)
                )}
            </ul>
        );

        return namebtns;
    }

    render() {
        const namebtns = this.generateButtons();
        return namebtns;
    }
}

class WeekPaginator extends React.Component {
    renderWeek(name, week, currentWeekNum) {
        return (
            <li key={week} className={'page-item'+(week===currentWeekNum?' active':'')} onClick={()=> this.props.onClick(name, week)}>
                <a className="page-link">{week}</a>
            </li>
        );
    }
    generateWeekPaginator() {
        const currentWeekNum = this.props.currentWeekNum;
        const name = this.props.name;
        const TOTAL_WEEK = 18;
        const PG_LENGTH = 5;
        let weekNum = [];
        if (currentWeekNum+PG_LENGTH <= TOTAL_WEEK) {
            for (let i=0; i<PG_LENGTH; i++) {
                weekNum.push(currentWeekNum+i);
            }
        }
        else {
            for (let i=0; i<PG_LENGTH; i++) {
                weekNum.unshift(TOTAL_WEEK-i);
            }
        }
        const weekpg = (
            <ul className="pagination pagination-circle pg-purple mb-0">
                <li className={'page-item clearfix d-none d-md-block'+(currentWeekNum===1?' disabled':'')}  onClick={()=> this.props.onClick(name, 1)}>
                    <a className="page-link">First</a>
                </li>
                <li className={'page-item'+(currentWeekNum===1?' disabled':'')} onClick={()=> this.props.onClick(name, currentWeekNum>1?currentWeekNum-1:1)}>
                    <a className="page-link" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span className="sr-only">Previous</span>
                    </a>
                </li>
                {weekNum.map(
                    (week) => this.renderWeek(name, week, currentWeekNum)
                )}
                <li className={'page-item'+(currentWeekNum===TOTAL_WEEK?' disabled':'')} onClick={()=> this.props.onClick(name, currentWeekNum<TOTAL_WEEK?currentWeekNum+1:TOTAL_WEEK)}>
                    <a className="page-link" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span className="sr-only">Next</span>
                    </a>
                </li>
                <li className={'page-item clearfix d-none d-md-block'+(currentWeekNum===TOTAL_WEEK?' disabled':'')}  onClick={()=> this.props.onClick(name, TOTAL_WEEK)}>
                    <a className="page-link">Last</a>
                </li>
            </ul>
        );

        return weekpg;
    }

    render() {
        const weekpg = this.generateWeekPaginator();
        return (
            <div className="d-flex justify-content-center">
                <nav className="my-4 pt-2">
                    {weekpg}
                </nav>
            </div>
        );
    }
}

class Schedule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'all',
            currentWeekNum: getCurrentWeekNum(),
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick = (name, week) => {
        this.setState({
            name: name,
            currentWeekNum: week,
        });
    }

    render() {
        const name = this.state.name;
        const currentWeekNum = this.state.currentWeekNum;
        const lessons = decorateTable(ci.getTableWraper(name, currentWeekNum));
        const currentWeek = getCurrentWeek(currentWeekNum);

        return (
            <section>
                <div className="row">
                    <div className="col-12">
                        <NameButton
                            currentWeekNum={currentWeekNum}
                            name={name}
                            onClick={(name, week) => this.handleClick(name, week)}
                        />
                        <SchduleTable
                            lessons={lessons}
                            currentWeek={currentWeek}
                            currentWeekNum={currentWeekNum}
                        />
                        <hr className="my-0" />
                        <WeekPaginator
                            currentWeekNum={currentWeekNum}
                            name={name}
                            onClick={(name, week) => this.handleClick(name, week)}
                        />
                    </div>
                </div>
                <ReactTooltip />
            </section>
        );
    }
}

ReactDOM.render(<Schedule />, document.getElementById("root"));

function getCurrentWeekNum() {
    const FIRST_SEMESTER_DAY = new Date('2017-09-03');
    const d = new Date();
    const currentWeekNum = Math.ceil((d.getTime() - FIRST_SEMESTER_DAY.getTime()) / (7 * 24 * 3600 * 1000))
    return currentWeekNum;
}

function getCurrentWeek(weekNum) {
    const WEEK_DAY_NAME = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const FIRST_SEMESTER_DAY = new Date('2017-09-03');
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

function getSectionTime() {
    const sectionTime = [
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
    ];
    return sectionTime;
}


function decorateTable(table) {
    const AM_SEP = 5;
    const PM_SEP = 10;
    const AM_COLOR = 'rgba-cyan';
    const PM_COLOR = 'rgba-orange';
    const NT_COLOR = 'rgba-stylish';
    const HOVER_EFF = 'hoverable';
    const H_ALIGN = 'text-center';
    const V_ALIGN = 'align-middle';
    const weekday = (new Date()).getDay();

    for (let i=0; i<13; i++) {
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
