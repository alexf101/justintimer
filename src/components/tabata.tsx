import moment, { Duration, Moment } from "moment";
import React from "react";
import styled from "styled-components";
import { Howl } from "howler";

const workSound = new Howl({ src: ["./work.mp3"] });
const restSound = new Howl({ src: ["./rest.mp3"] });
const workoutComplete = new Howl({ src: ["./workout_complete.mp3"] });
import { Button, RowDisplayWithEvenSpacing, SingleColumnDisplay, StartStopButton } from "./shared_ui";

import { TimeSinceState } from "./shared_interfaces";
import {
    TabataTimeRenderer,
    timeSoFar,
} from "./time_renderer";

interface TabataState extends TimeSinceState {
    numberOfRounds: number;
    exercisesPerRound: number;
    workTime: number;
    restTime: number;
}
export class Tabata extends React.Component<{}, TabataState> {
    static get initialState() {
        return {
            running: false,
            lastStoppedAtTimerTime: undefined,
            lastStartedAtWallClockTime: undefined,
            numberOfRounds: 8,
            exercisesPerRound: 3,
            workTime: 20,
            restTime: 10,
        };
    }
    state = Tabata.initialState;
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
            <SingleColumnDisplay>
                <TabataTimeRenderer
                    onCountdownComplete={() => {
                        console.log("Timer done!");

                        // Play the sound.
                        workoutComplete.play();
                        this.stop();
                    }}
                    secondsPerExercise={this.state.workTime}
                    secondsOfRest={this.state.restTime}
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
                <RowDisplayWithEvenSpacing>
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
                    <Button color="#efefef" onClick={this.reset}>Reset</Button>
                </RowDisplayWithEvenSpacing>
                {this.state.running || (
                    <TabataTimeChooser>
                        <InputRow>
                            Number of rounds{" "}
                            <input
                                type="number"
                                value={this.state.numberOfRounds}
                                onChange={(ev) =>
                                    this.setState({
                                        numberOfRounds: Number.parseInt(
                                            ev.currentTarget.value
                                        ) || 0,
                                    })
                                }
                            ></input>
                        </InputRow>
                        <InputRow>
                            Stations per round{" "}
                            <input
                                type="number"
                                value={this.state.exercisesPerRound}
                                onChange={(ev) =>
                                    this.setState({
                                        exercisesPerRound: Number.parseInt(
                                            ev.currentTarget.value
                                        ) || 0,
                                    })
                                }
                            ></input>
                        </InputRow>
                        <InputRow>
                            Work time (seconds){" "}
                            <input
                                type="number"
                                value={this.state.workTime}
                                onChange={(ev) =>
                                    this.setState({
                                        workTime: Number.parseInt(
                                            ev.currentTarget.value
                                        ) || 0,
                                    })
                                }
                            ></input>
                        </InputRow>
                        <InputRow>
                            Rest time (seconds){" "}
                            <input
                                type="number"
                                value={this.state.restTime}
                                onChange={(ev) =>
                                    this.setState({
                                        restTime: Number.parseInt(
                                            ev.currentTarget.value
                                        ) || 0,
                                    })
                                }
                            ></input>
                        </InputRow>
                    </TabataTimeChooser>
                )}
            </SingleColumnDisplay>
        );
    }
}

const TabataTimeChooser = styled.div``;

const InputRow = styled.div`
    line-height: 2em;
`
