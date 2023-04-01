import moment, { Duration, Moment } from "moment";
import React from "react";
import styled from "styled-components";
import { TimeSinceState } from "./shared_interfaces";
import { CountdownTimeRenderer, timeSoFar } from "./time_renderer";
interface TimerState extends TimeSinceState {
    setTime: Duration;
}
import { Howl } from "howler";
import { RowDisplayWithEvenSpacing, StartStopButton } from "./shared_ui";

// Setup our audio.
// Get new audio from https://ttsmp3.com/ US English/Salli.
const timesUpSound = new Howl({
    src: ["./timer_done.mp3"],
});
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
        const whitespace = " ";
        return (
            <SingleColumnDisplay>
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
                    <Button color="#efefef" onClick={this.reset}>
                        Reset
                    </Button>
                </RowDisplayWithEvenSpacing>
                {this.state.running || (
                    <TimeButtonGrid>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(1, "seconds")
                            )}
                        >
                            1{whitespace}s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(5, "seconds")
                            )}
                        >
                            5{whitespace}s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(10, "seconds")
                            )}
                        >
                            10{whitespace}s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(20, "seconds")
                            )}
                        >
                            20{whitespace}s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(30, "seconds")
                            )}
                        >
                            30{whitespace}s
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(1, "minute")
                            )}
                        >
                            1{whitespace}m
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(2, "minutes")
                            )}
                        >
                            2{whitespace}m
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(5, "minutes")
                            )}
                        >
                            5{whitespace}m
                        </AddTimeButton>
                        <AddTimeButton
                            onClick={makeTimeIncrementer(
                                moment.duration(10, "minutes")
                            )}
                        >
                            10{whitespace}m
                        </AddTimeButton>
                        <ClearButton onClick={this.clear}>Clear</ClearButton>
                    </TimeButtonGrid>
                )}
            </SingleColumnDisplay>
        );
    }
}

const BluishButtonStyles = `
    background: #87cefa9c;
    box-shadow: inset 0px 0px 2px lightgrey;
    border-radius: 4px;
    &:hover {
        background: #87cefa;
    }
`;

const AddTimeButton = styled.button`
    ${BluishButtonStyles}
    font-size: 20px;
    width: 3.23em;
    height: 2em;
    margin: 4px;
`;

const TimeButtonGrid = styled.div`
    display: grid;
    grid-template-columns: auto auto auto;
    width: fit-content;
    margin: auto;
`;

const SingleColumnDisplay = styled.div`
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

const ClearButton = styled(Button)`
    ${BluishButtonStyles}
    grid-row: 4;
    grid-column: span 3;
    margin: 4px;
`;
