import moment, { Duration, Moment } from "moment";
import React from "react";
import styled from "styled-components";
import { Howl } from "howler";

// Setup our audio.
// Get new audio from https://ttsmp3.com/ US English/Salli.
const timesUpSound = new Howl({
    src: ["./timer_done.mp3"],
});
const workSound = new Howl({ src: ["./work.mp3"] });
const restSound = new Howl({ src: ["./rest.mp3"] });
const workoutComplete = new Howl({ src: ["./workout_complete.mp3"] });

import { TimeSinceState } from "./shared_interfaces";
import {
    CountdownTimeRenderer,
    CountupTimeRenderer,
    TabataTimeRenderer,
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
                    onCountdownComplete={() => {
                        console.log("Timer done!");

                        // Play the sound.
                        timesUpSound.play();
                        this.stop();
                    }}
                    countDownFrom={this.state.setTime}
                    {...this.state}
                />
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
                </Controls>
                {this.state.running || (
                    <TimeButtonGrid>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(1, "seconds")
                            )}
                        >
                            1s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(5, "seconds")
                            )}
                        >
                            5s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(10, "seconds")
                            )}
                        >
                            10s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(20, "seconds")
                            )}
                        >
                            20s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(30, "seconds")
                            )}
                        >
                            30s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(45, "seconds")
                            )}
                        >
                            45s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(1, "minute")
                            )}
                        >
                            1m
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(2, "minutes")
                            )}
                        >
                            2m
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(5, "minutes")
                            )}
                        >
                            5m
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(10, "minutes")
                            )}
                        >
                            10m
                        </AddTimeButton>
                        <Button onClick={this.clear}>Clear</Button>
                    </TimeButtonGrid>
                )}
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

interface TabataState extends TimeSinceState {
    numberOfRounds: number;
    exercisesPerRound: number;
}
export class Tabata extends React.Component<{}, TabataState> {
    static get initialState() {
        return {
            running: false,
            lastStoppedAtTimerTime: undefined,
            lastStartedAtWallClockTime: undefined,
            numberOfRounds: 8,
            exercisesPerRound: 3,
        };
    }
    state = Tabata.initialState;
    static SecondsPerExercise = 20;
    static SecondsOfRest = 10;
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
        this.setState(Tabata.initialState);
    };
    render() {
        return (
            <StopwatchRoot>
                <TabataTimeRenderer
                    onCountdownComplete={() => {
                        console.log("Timer done!");

                        // Play the sound.
                        workoutComplete.play();
                        this.stop();
                    }}
                    secondsPerExercise={Tabata.SecondsPerExercise}
                    secondsOfRest={Tabata.SecondsOfRest}
                    onWork={() => {
                        console.log("Work start.");
                        workSound.play();
                    }}
                    onRest={() => {
                        console.log("Rest start.");
                        restSound.play();
                    }}
                    {...this.state}
                />
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
                </Controls>
                {this.state.running || (
                    <TabataTimeChooser>
                        <div>
                            Number of rounds{" "}
                            <input
                                type="number"
                                value={this.state.numberOfRounds}
                                onChange={(ev) =>
                                    this.setState({
                                        numberOfRounds: Number.parseInt(
                                            ev.currentTarget.value
                                        ),
                                    })
                                }
                            ></input>
                        </div>
                        <div>
                            Stations per round{" "}
                            <input
                                type="number"
                                value={this.state.exercisesPerRound}
                                onChange={(ev) =>
                                    this.setState({
                                        exercisesPerRound: Number.parseInt(
                                            ev.currentTarget.value
                                        ),
                                    })
                                }
                            ></input>
                        </div>
                    </TabataTimeChooser>
                )}
            </StopwatchRoot>
        );
    }
}

const TabataTimeChooser = styled.div``;

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
    width: 560px;
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const Button = styled.button`
    padding: 4px;
    border-radius: 4px;
    font-size: 20px;
`;

const ClearButton = Button;
