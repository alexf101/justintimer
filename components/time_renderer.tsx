import moment, { Duration, Moment } from "moment";
import React from "react";
import styled from "styled-components";
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
    if (previouslyAccumulated) {
        return timeSinceLastStarted.add(previouslyAccumulated);
    } else {
        return timeSinceLastStarted;
    }
}

export class CountupTimeRenderer extends React.Component<TimeSinceState, {}> {
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

interface CountdownProps extends TimeSinceState {
    countDownFrom: Duration;
    onCountdownComplete: () => void;
}

export class CountdownTimeRenderer extends React.Component<CountdownProps, {}> {
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
        document.title = timeStringNoMillis;
        const timeString = `${timeStringNoMillis}.${padZeros(
            t.milliseconds(),
            3
        )}`;
        return <TimeDisplay>{timeString}</TimeDisplay>;
    }
}

function padZeros(input: number, desiredLength: number): string {
    const result = input.toString();
    const padLength = desiredLength - result.length;
    return "0".repeat(padLength) + result;
}

const TimeDisplay = styled.div`
    font-size: 26px;
    font-weight: bold;
    font-family: monospace;
    margin: 12px auto;
    text-align: center;
`;
