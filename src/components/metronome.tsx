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
}
export class Metronome extends React.Component<
    {},
    MetronomeState
> {
    nextBeatTimer: null | NodeJS.Timeout = null;
    state = {
        running: false,
        bpm: 60,
    };
    start = () => {
        this.setState({
            running: true,
        });
    };
    stop = () => {
        this.setState({
            running: false,
        });
    };
    get beatIntervalMillis() {
        // Quick check:
        // 1. 60 bpm should equal 1000 milliseconds: (60 / 60) * 1000.
        // 2. 120 bpm should equal 500 milliseconds: (60 / 120) * 1000.
        return (60 / this.state.bpm) * 1000;
    }
    soundClick = () => {
        console.log("click...");
    };
    componentDidUpdate(prevProps: {}, prevState: MetronomeState) {
        // Update the state of audible timer if it's no longer in sync with "running".
        if (this.state.running && this.nextBeatTimer === null) {
            // Near enough is good enough for this because the errors don't compound over time; we
            // only care that the intervals are close to the desired interval, not that the overall
            // time elapsed is accurate.
            this.nextBeatTimer = setInterval(
                this.soundClick,
                this.beatIntervalMillis,
            );
        } else if (!this.state.running && this.nextBeatTimer !== null) {
            clearInterval(this.nextBeatTimer);
        } else if (this.state.running && this.state.bpm !== prevState.bpm) {
            clearInterval(this.nextBeatTimer!);
            this.nextBeatTimer = setInterval(
                this.soundClick,
                this.beatIntervalMillis,
            );
        }
    }
    render() {
        return (
            <SingleColumnDisplay>
                <Slider
                    onSetBpm={(bpm: number) => this.setState({ bpm })}
                    bpm={this.state.bpm}
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

const Slider = (props: { bpm: number; onSetBpm: (bpm: number) => void }) => {
    return (
        <MUISlider
            value={props.bpm}
            onChange={(_, val) => props.onSetBpm(val as number)}
            marks
            step={10}
            min={10}
            max={180}
            valueLabelDisplay={'auto'}
        />
    );
};
