import moment, { Duration, Moment } from "moment";
import React from "react";
import styled from "styled-components";

import {
    Button,
    RowDisplayWithEvenSpacing,
    SingleColumnDisplay,
    StartStopButton,
} from "./shared_ui";
import { CountupTimeRenderer, timeSoFar } from "./time_renderer";
import { Slider as MUISlider } from "@mui/material";

interface MetronomeState {
    running: boolean;
    bpm: number;
    beatsPerBar: number;
    currentBeat: number;
}

export class Metronome extends React.Component<{}, MetronomeState> {
    nextBeatTimer: null | NodeJS.Timeout = null;
    state = {
        running: false,
        bpm: 60,
        beatsPerBar: 4,
        currentBeat: 1,
    };

    start = () => {
        this.setState({
            running: true,
        });
    };

    stop = () => {
        this.setState({
            running: false,
            currentBeat: 1, // Reset to the first beat when stopped
        });
    };

    get beatIntervalMillis() {
        return (60 / this.state.bpm) * 1000;
    }

    handleNextBeat = () => {
        const { currentBeat, beatsPerBar } = this.state;

        // Log the sound based on the current beat
        if (currentBeat === 1) {
            console.log("Emphasised click (first beat of the bar)...");
        } else {
            console.log("Regular click...");
        }

        // Update the state to progress to the next beat
        this.setState({
            currentBeat: currentBeat % beatsPerBar + 1,
        });
    };

    componentDidUpdate(prevProps: {}, prevState: MetronomeState) {
        if (this.state.running && this.nextBeatTimer === null) {
            this.nextBeatTimer = setInterval(
                this.handleNextBeat,
                this.beatIntervalMillis,
            );
        } else if (!this.state.running && this.nextBeatTimer !== null) {
            clearInterval(this.nextBeatTimer);
            this.nextBeatTimer = null;
        } else if (
            this.state.running &&
            (this.state.bpm !== prevState.bpm || this.state.beatsPerBar !== prevState.beatsPerBar)
        ) {
            clearInterval(this.nextBeatTimer!);
            this.nextBeatTimer = setInterval(
                this.handleNextBeat,
                this.beatIntervalMillis,
            );
        }
    }

    render() {
        return (
            <SingleColumnDisplay>
                <Slider
                    onSetBpm={(bpm: number) => this.setState({ bpm })}
                    onSetBarLength={(beatsPerBar: number) =>
                        this.setState({ beatsPerBar })
                    }
                    bpm={this.state.bpm}
                    beatsPerBar={this.state.beatsPerBar}
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
                </RowDisplayWithEvenSpacing>
            </SingleColumnDisplay>
        );
    }
}

const Slider = (props: {
    bpm: number;
    beatsPerBar: number;
    onSetBpm: (bpm: number) => void;
    onSetBarLength: (beatsPerBar: number) => void;
}) => {
    return (
        <div>
            <label>
                Beats per Minute
                <MUISlider
                    value={props.bpm}
                    onChange={(_, val) => props.onSetBpm(val as number)}
                    marks
                    step={10}
                    min={10}
                    max={180}
                    valueLabelDisplay={"auto"}
                />
            </label>
            <label>
                Beats per Bar
                <MUISlider
                    value={props.beatsPerBar}
                    onChange={(_, val) => props.onSetBarLength(val as number)}
                    marks
                    step={1}
                    min={1}
                    max={8}
                    valueLabelDisplay={"auto"}
                />
            </label>
        </div>
    );
};
