import moment, { Duration, Moment } from "moment";
import React from "react";
import styled from "styled-components";

// debug
window.moment = moment;

function timeSoFar(
    lastStartedAt: Moment | undefined,
    previouslyAccumulated: Duration | undefined
): Duration {
    let timeSinceLastStarted;
    if (lastStartedAt === undefined) {
        timeSinceLastStarted = moment.duration(0);
    }
    timeSinceLastStarted = moment.duration(moment().diff(lastStartedAt));
    if (previouslyAccumulated) {
        return timeSinceLastStarted.add(previouslyAccumulated);
    } else {
        return timeSinceLastStarted;
    }
}

interface StopwatchState {
    // StopwatchState: running or paused, time last started at, time last played
    running: boolean;
    lastStartedAtWallClockTime?: Moment;
    lastStoppedAtTimerTime?: Duration;
}

export class Stopwatch extends React.Component<{}, StopwatchState> {
    static get initialState() {
        return {
            running: false,
            lastStoppedAtTimerTime: undefined,
            lastStartedAtWallClockTime: undefined,
        };
    }
    state = Stopwatch.initialState;
    start = () => {
        this.setState({
            running: true,
            lastStartedAtWallClockTime: moment(),
        });
    };
    stop = () => {
        this.setState({
            running: false,
            lastStoppedAtTimerTime: timeSoFar(
                this.state.lastStartedAtWallClockTime,
                this.state.lastStoppedAtTimerTime
            ),
        });
    };
    render() {
        return (
            <div>
                <TimeRenderer {...this.state} />
                <Controls>
                    <StartStopButton
                        running={this.state.running}
                        onClick={() => {
                            if (this.state.running) {
                                this.stop();
                            } else {
                                this.start();
                            }
                        }}
                    />
                    <ResetButton
                        onClick={() => this.setState(Stopwatch.initialState)}
                    ></ResetButton>
                </Controls>
            </div>
        );
    }
}

interface TimeRendererProps extends StopwatchState {}
class TimeRenderer extends React.Component<TimeRendererProps, {}> {
    cancel?: number;
    componentDidMount() {
        this.cancel = requestAnimationFrame(this.loop);
    }
    componentWillUnmount() {
        if (typeof this.cancel === "number") {
            window.cancelAnimationFrame(this.cancel);
        }
    }
    loop = () => {
        if (this.props.running) {
            this.setState({});
        }
        this.cancel = requestAnimationFrame(this.loop);
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
        return (
            <TimeDisplay>
                {`${padZeros(t.hours(), 2)}:${padZeros(
                    t.minutes(),
                    2
                )}:${padZeros(t.seconds(), 2)}.${padZeros(
                    t.milliseconds(),
                    3
                )}`}
            </TimeDisplay>
        );
    }
}

function padZeros(input: number, desiredLength: number): string {
    const result = input.toString();
    const padLength = desiredLength - result.length;
    return "0".repeat(padLength) + result;
}

const TimeDisplay = styled.div`
    font-size: 20px;
    margin: 12px;
`;

const StartStopButton = ({
    running,
    onClick,
}: {
    running: boolean;
    onClick: () => void;
}) => {
    const text = running ? "Stop" : "Start";
    return <button onClick={onClick}>{text}</button>;
};

const ResetButton = ({ onClick }: { onClick: () => void }) => {
    return <button onClick={onClick}>Reset</button>;
};

const Controls = styled.div`
    display: flex;
    flex-direction: row;
    > * {
        flex: 1 0 0;
    }
`;
