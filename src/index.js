import React from 'react';
import ReactDOM from 'react-dom';
import ReactTooltip from 'react-tooltip'
import ClassInfo from './js/class-info';
import DateTool from './js/date-tool';
import './css/bootstrap.min.css'
import './css/mdb.min.css'
import './css/index.css'

const ci = new ClassInfo();
const dt = new DateTool();

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
        const sectionTime = dt.getSectionTime();
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
    renderButton(name, currentName) {
        const C_COLOR = 'btn btn-primary waves-effect waves-light list-inline-item';
        const U_COLOR = 'btn btn-secondary waves-effect waves-light list-inline-item';
        return (
            <li key={name} className={name===currentName ? C_COLOR : U_COLOR} onClick={() => this.props.onClick(name)}>
                {name}
            </li>
        );
    }
    generateButtons() {
        const currentName = this.props.name;
        let names = ci.getNames();
        names.unshift('all');
        const namebtns = (
            <ul className="list-inline">
                {names.map(
                    (name) =>
                        this.renderButton(name, currentName)
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
    renderWeek(week, currentWeekNum) {
        return (
            <li key={week} className={'page-item'+(week===currentWeekNum?' active':'')} onClick={()=> this.props.onClick(week)}>
                <a className="page-link">{week}</a>
            </li>
        );
    }
    generateWeekPaginator() {
        const currentWeekNum = this.props.currentWeekNum;
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
                <li className={'page-item clearfix d-none d-md-block'+(currentWeekNum===1?' disabled':'')}  onClick={()=> this.props.onClick(1)}>
                    <a className="page-link">First</a>
                </li>
                <li className={'page-item'+(currentWeekNum===1?' disabled':'')} onClick={()=> this.props.onClick(currentWeekNum>1?currentWeekNum-1:1)}>
                    <a className="page-link" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                        <span className="sr-only">Previous</span>
                    </a>
                </li>
                {weekNum.map(
                    (week) => this.renderWeek(week, currentWeekNum)
                )}
                <li className={'page-item'+(currentWeekNum===TOTAL_WEEK?' disabled':'')} onClick={()=> this.props.onClick(currentWeekNum<TOTAL_WEEK?currentWeekNum+1:TOTAL_WEEK)}>
                    <a className="page-link" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                        <span className="sr-only">Next</span>
                    </a>
                </li>
                <li className={'page-item clearfix d-none d-md-block'+(currentWeekNum===TOTAL_WEEK?' disabled':'')}  onClick={()=> this.props.onClick(TOTAL_WEEK)}>
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
            currentWeekNum: dt.getCurrentWeekNum(),
            currentTime: (new Date()).getTime(),
        };
        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        1000
      );
    }

    tick() {
      this.setState({
        currentTime: (new Date()).getTime(),
      });
    }

    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    componentDidUpdate() {
        ReactTooltip.rebuild();
    }

    handleClick = (name=this.state.name, week=this.state.currentWeekNum) => {
        this.setState({
            name: name,
            currentWeekNum: week,
        });
    }

    render() {
        const name = this.state.name;
        const currentWeekNum = this.state.currentWeekNum;
        const lessons = dt.decorateTable(ci.getTableWraper(name, currentWeekNum));
        const currentWeek = dt.getCurrentWeek(currentWeekNum);

        return (
            <section>
                <div className="row">
                    <div className="col-12">
                        {ci.getNames().length > 1 &&
                        <NameButton
                            currentWeekNum={currentWeekNum}
                            name={name}
                            onClick={(name) => this.handleClick(name, undefined)}
                        />
                        }
                        <SchduleTable
                            lessons={lessons}
                            currentWeek={currentWeek}
                            currentWeekNum={currentWeekNum}
                        />
                        <hr className="my-0" />
                        <WeekPaginator
                            currentWeekNum={currentWeekNum}
                            onClick={(week) => this.handleClick(undefined, week)}
                        />
                    </div>
                </div>
                <ReactTooltip />
            </section>
        );
    }
}

ReactDOM.render(<Schedule />, document.getElementById("root"));

