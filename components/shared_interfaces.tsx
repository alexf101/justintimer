import { Duration, Moment } from "moment";

export interface TimeSinceState {
    // StopwatchState: running or paused, time last started at, time last played
    running: boolean;
    lastStartedAtWallClockTime?: Moment;
    lastStoppedAtTimerTime?: Duration;
}
