import { isEqual } from "lodash";
import moment, { Duration, Moment } from "moment";
import React from "react";
import styled from "styled-components";
import { TabataConfig, TabataLogicHelper } from "../libs/tabata_logic_helper";
import { TimeSinceState } from "./shared_interfaces";

export function timeSoFar(
    lastStartedAt: Moment | undefined,
    previouslyAccumulated: Duration | undefined
): Duration {
    let timeSinceLastStarted;
    if (lastStartedAt === undefined) {
        timeSinceLastStarted = moment.duration(0);
    } else {
        timeSinceLastStarted = moment.duration(moment().diff(lastStartedAt));
    }
    // Uncomment to accelerate time for 'testing'
    timeSinceLastStarted
        .add(timeSinceLastStarted)
        .add(timeSinceLastStarted)
        .add(timeSinceLastStarted);
    if (previouslyAccumulated) {
        return timeSinceLastStarted.add(previouslyAccumulated);
    } else {
        return timeSinceLastStarted;
    }
}

function updateDocumentTitle(newTitle: string) {
    if (document.title !== newTitle) {
        document.title = newTitle;
    }
}

export class CountupTimeRenderer extends React.Component<TimeSinceState, {}> {
    cancel?: number;
    componentDidMount() {
        this.cancel = raf(this.loop);
    }
    componentWillUnmount() {
        if (typeof this.cancel === "number") {
            caf(this.cancel);
        }
    }
    loop = () => {
        if (this.props.running) {
            this.setState({});
        }
        this.cancel = raf(this.loop);
    };
    render() {
        let t;
        if (
            !this.props.running &&
            this.props.lastStoppedAtTimerTime !== undefined
        ) {
            t = this.props.lastStoppedAtTimerTime;
        } else {
            t = timeSoFar(
                this.props.lastStartedAtWallClockTime,
                this.props.lastStoppedAtTimerTime
            );
        }
        const timeStringNoMillis = `${padZeros(t.hours(), 2)}:${padZeros(
            t.minutes(),
            2
        )}:${padZeros(t.seconds(), 2)}`;
        updateDocumentTitle(timeStringNoMillis);
        const timeStringMillis = `${padZeros(t.milliseconds(), 3)}`;
        return (
            <TimeDisplay>
                {timeStringNoMillis}
                <MillisDisplay>{timeStringMillis}</MillisDisplay>
            </TimeDisplay>
        );
    }
}

type TabataProps = TimeSinceState &
    TabataConfig & {
        onCountdownComplete: () => void;
        onWork: () => void;
        onRest: () => void;
    };

// I used to do this all with maths, but that got complicated and buggy.
// Instead, we make the logic feel similar to the desired interface:
// - Construct an array of time slots for work and rest
// - Choose the appropriate time slot based on the current time.
// - Transitions from one to the other trigger the voice indicator.
export class TabataTimeRenderer extends React.Component<TabataProps, {}> {
    cancel?: number;
    justOnceAtTheStart = false;
    tabataHelper: TabataLogicHelper;
    constructor(props: TabataProps) {
        super(props);
        this.tabataHelper = new TabataLogicHelper(props);
    }
    componentDidUpdate(prevProps: TabataProps) {
        if (!isEqual(prevProps, this.props)) {
            this.tabataHelper = new TabataLogicHelper(this.props);
        }
    }
    componentDidMount() {
        this.cancel = raf(this.loop);
    }
    componentWillUnmount() {
        if (typeof this.cancel === "number") {
            caf(this.cancel);
        }
    }
    loop = () => {
        if (this.props.running) {
            this.setState({});
        }
        this.cancel = raf(this.loop);
    };
    get countDownFrom(): Duration {
        return moment.duration(this.tabataHelper.secondsTotal, "seconds");
    }
    getCurrentRound(timeRemaining: Duration) {
        return this.tabataHelper.roundAt(timeRemaining.asSeconds());
    }
    getTimeRemainingInExercise(timeRemaining: Duration) {
        return this.getCurrentRound(timeRemaining).remainingTimeInState(timeRemaining.asSeconds());
    }
    isWorkTime(timeRemaining: Duration): boolean {
        // We want to start with the work interval.
        return this.tabataHelper.stateAt(timeRemaining.asSeconds()) === "work";
    }
    render() {
        let timeRemaining: Duration;
        if (
            !this.props.running &&
            this.props.lastStoppedAtTimerTime !== undefined
        ) {
            timeRemaining = this.countDownFrom.subtract(
                this.props.lastStoppedAtTimerTime
            );
        } else {
            timeRemaining = this.countDownFrom.subtract(
                timeSoFar(
                    this.props.lastStartedAtWallClockTime,
                    this.props.lastStoppedAtTimerTime
                )
            );
        }
        if (timeRemaining.asMilliseconds() < 0) {
            timeRemaining = moment.duration(0);
            // Note: if we call setState in a parent component to stop running, we don't want to risk calling any callbacks again here - so always check this.props.running.
            if (this.props.running) {
                window.setTimeout(
                    () =>
                        this.props.onCountdownComplete &&
                        this.props.onCountdownComplete(),
                    0
                );
            }
        }
        const timeStringNoMillis = `${padZeros(
            timeRemaining.hours(),
            2
        )}:${padZeros(timeRemaining.minutes(), 2)}:${padZeros(
            timeRemaining.seconds(),
            2
        )}`;
        updateDocumentTitle(timeStringNoMillis);
        const timeStringMillis = `${padZeros(timeRemaining.milliseconds(), 3)}`;
        if (this.props.running && !this.justOnceAtTheStart) {
            this.justOnceAtTheStart = true;
            this.props.onWork();
        }
        const seconds = this.getTimeRemainingInExercise(timeRemaining).toFixed(0);
        return (
            <div>
                <TabataRow>
                    <TimeDisplay>
                        {seconds}
                        <MillisDisplay>{timeStringMillis}</MillisDisplay>
                    </TimeDisplay>
                </TabataRow>
                <TabataRow>
                    <SideBySide>
                        <ExerciseAndRoundCountContainer>
                            Round <Big>{this.getCurrentRound(timeRemaining).roundNumber}{" "}</Big>
                            of {this.props.numberOfRounds}
                        </ExerciseAndRoundCountContainer>
                        <ExerciseAndRoundCountContainer>
                            Exercise{" "}
                            <Big>{this.getCurrentRound(timeRemaining).exerciseNumber}</Big>
                            of{" "}
                            {this.props.exercisesPerRound}
                        </ExerciseAndRoundCountContainer>
                    </SideBySide>
                </TabataRow>
                <TabataRow>
                    <ProgressBar>
                        {Array(this.props.numberOfRounds).fill(null).map((_, round) => {
                            const isCompletedRound = round > (this.props.numberOfRounds - this.getCurrentRound(timeRemaining).roundNumber);
                            const isCurrentRound = round === this.props.numberOfRounds - this.getCurrentRound(timeRemaining).roundNumber;
                            return <ProgressRound completed={isCompletedRound}>
                                {Array(this.props.exercisesPerRound).fill(null).map((_, exercise) => {
                                    const isCompletedExercise = exercise > (this.props.exercisesPerRound - this.getCurrentRound(timeRemaining).exerciseNumber);
                                    const isCurrentExercise = exercise === this.props.exercisesPerRound - this.getCurrentRound(timeRemaining).exerciseNumber;
                                    return <ProgressExercise completed={isCompletedRound || (isCurrentRound && isCompletedExercise)} />
                                }
                                )}
                            </ProgressRound>
                        }
                        )}
                    </ProgressBar>
                </TabataRow>
                <TabataRow>
                    <WorkRestDisplay
                        isRunning={this.props.running}
                        isWorkTime={this.isWorkTime(timeRemaining)}
                        onWork={this.props.onWork}
                        onRest={this.props.onRest}
                    />
                </TabataRow>
            </div>
        );
    }
}

const Big = styled.span`font-size: 2em;`;

const ExerciseAndRoundCountContainer = styled.div`
    display: inline-block;
    font-size: 1.5em;
    padding: 8px;
    width: 50%;
    text-align: center;
    border-left: 1px solid black;
`;

const ProgressBar = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    margin: 4px;
    height: 20px;
    padding: 2px;
    background-color: black;
`;

const ProgressRound = styled.div<{ completed: boolean }>`
    visibility: ${props => props.completed ? "hidden" : "visible"};
    border: 2px solid black;
    width: 30px;
    height: 100%;
    flex-basis: 1em;
    flex-grow: 1;
    display: flex;
    flex-direction: row;
`;
const ProgressExercise = styled.div<{ completed: boolean }>`
    visibility: ${props => props.completed ? "hidden" : "visible"};
    border: 1px solid grey;
    width: 10px;
    height: 100%;
    flex-basis: 1em;
    flex-grow: 1;
    background-color: blue;
`;

const TabataRow = styled.div`
    display: flex;
    border: 1px solid black;
`;

const SideBySide = styled.div`
    display: flex;
    direction: row;
    justify-content: space-between;
    font-size: larger;
    font-family: sans-serif;
    width: 100%;
`;

interface WorkRestDisplayProps {
    isWorkTime: boolean;
    isRunning: boolean;
    onWork: () => void;
    onRest: () => void;
}
class WorkRestDisplay extends React.Component<WorkRestDisplayProps> {
    componentDidUpdate(prevProps: WorkRestDisplayProps) {
        if (
            this.props.isRunning &&
            this.props.isWorkTime !== prevProps.isWorkTime
        ) {
            if (this.props.isWorkTime) {
                this.props.onWork();
            } else {
                this.props.onRest();
            }
        }
    }
    render() {
        return (
            <WorkRestDisplayRoot workTime={this.props.isWorkTime}>
                {this.props.isWorkTime ? "Work" : "Rest"}
            </WorkRestDisplayRoot>
        );
    }
}
const WorkRestDisplayRoot = styled.div<{ workTime: boolean }>`
    background-color: ${(props) => (props.workTime ? "green" : "red")};
    color: ${(props) => (props.workTime ? "black" : "white")};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    font-size: 2rem;
    font-family: sans-serif;
    width: 100%;
`;

interface CountdownProps extends TimeSinceState {
    countDownFrom: Duration;
    onCountdownComplete: () => void;
}

// I used to use requestAnimationFrame for this, but it doesn't run on background tabs, which is an important use case here - i.e., the timer sound must play if the time runs out and the document title must be updated even on background tabs.
function raf(callback: TimerHandler) {
    // TODO if it proves necessary:
    // - an implementation that acts more like raf
    // - a sleepy mode for background tabs, e.g. set interval to 100 instead of 16.
    return setTimeout(callback, 16);
}
function caf(timer: number) {
    clearTimeout(timer);
}

export class CountdownTimeRenderer extends React.Component<CountdownProps, {}> {
    cancel?: number;
    componentDidMount() {
        this.cancel = raf(this.loop);
    }
    componentWillUnmount() {
        if (typeof this.cancel === "number") {
            caf(this.cancel);
        }
    }
    loop = () => {
        if (this.props.running) {
            this.setState({});
        }
        this.cancel = raf(this.loop);
    };
    render() {
        let t;
        if (
            !this.props.running &&
            this.props.lastStoppedAtTimerTime !== undefined
        ) {
            t = this.props.countDownFrom
                .clone()
                .subtract(this.props.lastStoppedAtTimerTime);
        } else {
            t = this.props.countDownFrom
                .clone()
                .subtract(
                    timeSoFar(
                        this.props.lastStartedAtWallClockTime,
                        this.props.lastStoppedAtTimerTime
                    )
                );
        }
        if (t.asMilliseconds() < 0) {
            t = moment.duration(0);
            // Note: if we call setState in a parent component to stop running, we don't want to risk calling any callbacks again here - so always check this.props.running.
            if (this.props.running) {
                window.setTimeout(
                    () =>
                        this.props.onCountdownComplete &&
                        this.props.onCountdownComplete(),
                    0
                );
            }
        }
        const timeStringNoMillis = `${padZeros(t.hours(), 2)}:${padZeros(
            t.minutes(),
            2
        )}:${padZeros(t.seconds(), 2)}`;
        updateDocumentTitle(timeStringNoMillis);
        const timeStringMillis = `${padZeros(t.milliseconds(), 3)}`;
        return (
            <TimeDisplay>
                {timeStringNoMillis}
                <MillisDisplay>{timeStringMillis}</MillisDisplay>
            </TimeDisplay>
        );
    }
}

function padZeros(input: number, desiredLength: number): string {
    const result = input.toString();
    const padLength = desiredLength - result.length;
    return "0".repeat(padLength) + result;
}

const MillisDisplay = styled.div`
    font-size: 16px;
    position: absolute;
    bottom: -8px;
    right: 0;
`;
const TimeDisplay = styled.div`
    position: relative;
    font-size: 100px;
    font-weight: bold;
    font-family: monospace;
    margin: 12px auto;
    text-align: center;
    width: fit-content;
`;
