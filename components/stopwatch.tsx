import moment, { Duration, Moment } from "moment";
import React from "react";
import styled from "styled-components";
import { TimeSinceState } from "./shared_interfaces";
import {
    CountdownTimeRenderer,
    CountupTimeRenderer,
    timeSoFar,
} from "./time_renderer";

interface TimerState extends TimeSinceState {
    setTime: Duration;
}

export class Timer extends React.Component<{}, TimerState> {
    static get initialState() {
        return {
            running: false,
            lastStoppedAtTimerTime: undefined,
            lastStartedAtWallClockTime: undefined,
            setTime: moment.duration(0, "seconds"),
        };
    }
    state = Timer.initialState;
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
    reset = () => {
        // Clears everything except for setTime
        this.setState({
            running: false,
            lastStoppedAtTimerTime: undefined,
            lastStartedAtWallClockTime: undefined,
        });
    };
    clear = () => {
        // Clears everything.
        this.setState(Timer.initialState);
    };
    render() {
        // This little factory returns a new function that calls setState with the given duration added to setTime.
        const makeTimeIncrementer = (duration: Duration) => {
            return () =>
                this.setState((prevState) => {
                    return {
                        setTime: duration.clone().add(prevState.setTime),
                    };
                });
        };
        return (
            <StopwatchRoot>
                <CountdownTimeRenderer
                    onCountdownComplete={function (): void {
                        throw new Error("Function not implemented.");
                    }}
                    {...this.state}
                    countDownFrom={this.state.setTime}
                />
                <TimeButtonGrid>
                    <AddTimeButton
                        onClick={makeTimeIncrementer(
                            moment.duration(5, "seconds")
                        )}
                    >
                        +5s
                    </AddTimeButton>
                    <AddTimeButton
                        onClick={makeTimeIncrementer(
                            moment.duration(10, "seconds")
                        )}
                    >
                        +10s
                    </AddTimeButton>
                    <AddTimeButton
                        onClick={makeTimeIncrementer(
                            moment.duration(15, "seconds")
                        )}
                    >
                        +15s
                    </AddTimeButton>
                    <AddTimeButton
                        onClick={makeTimeIncrementer(
                            moment.duration(20, "seconds")
                        )}
                    >
                        +20s
                    </AddTimeButton>
                    <AddTimeButton
                        onClick={makeTimeIncrementer(
                            moment.duration(30, "seconds")
                        )}
                    >
                        +30s
                    </AddTimeButton>
                    <AddTimeButton
                        onClick={makeTimeIncrementer(
                            moment.duration(1, "minute")
                        )}
                    >
                        +1m
                    </AddTimeButton>
                    <AddTimeButton
                        onClick={makeTimeIncrementer(
                            moment.duration(2, "minutes")
                        )}
                    >
                        +2m
                    </AddTimeButton>
                    <AddTimeButton
                        onClick={makeTimeIncrementer(
                            moment.duration(5, "minutes")
                        )}
                    >
                        +5m
                    </AddTimeButton>
                </TimeButtonGrid>
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
                    <Button onClick={this.reset}>Reset</Button>
                    <Button onClick={this.clear}>Clear</Button>
                </Controls>
            </StopwatchRoot>
        );
    }
}

const AddTimeButton = styled.button``;

const TimeButtonGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    max-width: 500px;
`;

export class Stopwatch extends React.Component<{}, TimeSinceState> {
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
            <StopwatchRoot>
                <CountupTimeRenderer {...this.state} />
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
                    <Button
                        onClick={() => this.setState(Stopwatch.initialState)}
                    >
                        Reset
                    </Button>
                </Controls>
            </StopwatchRoot>
        );
    }
}

const StartStopButton = ({
    running,
    onClick,
}: {
    running: boolean;
    onClick: () => void;
}) => {
    const text = running ? "Stop" : "Start";
    return <Button onClick={onClick}>{text}</Button>;
};

const Controls = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    > * {
        flex: 1 0 0;
        max-width: 100px;
    }
`;

const StopwatchRoot = styled.div`
    width: 280px;
    margin: 16px auto;
`;

const Button = styled.button`
    padding: 4px;
    border-radius: 4px;
    font-size: 20px;
`;

const ClearButton = Button;