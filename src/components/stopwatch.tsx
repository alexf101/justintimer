import moment, { Duration, Moment } from "moment";
import React from "react";
import styled from "styled-components";

import { TimeSinceState } from "./shared_interfaces";
import { Button, RowDisplayWithEvenSpacing, SingleColumnDisplay, StartStopButton } from "./shared_ui";
import {
    CountupTimeRenderer,
    timeSoFar,
} from "./time_renderer";

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
            <SingleColumnDisplay>
                <CountupTimeRenderer {...this.state} />
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
                    <Button
                        onClick={() => this.setState(Stopwatch.initialState)}
                    >
                        Reset
                    </Button>
                </RowDisplayWithEvenSpacing>
            </SingleColumnDisplay>
        );
    }
}
