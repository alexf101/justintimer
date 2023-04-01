import {describe, expect, test} from '@jest/globals';
import { formatTime, TabataLogicHelper } from 'libs/tabata_logic_helper';

describe('tabataLogicHelper', () => {
  test('typical config', () => {
    const tlh = new TabataLogicHelper({
        exercisesPerRound: 3,
        numberOfRounds: 8,
        secondsPerExercise: 20,
        secondsOfRest: 10
    });
    expect(tlh.startSeconds()).toEqual(12 * 60);
    // time, state
    [
        [12 * 60 + 1, "rest"],
        [12 * 60 + 0, "work"],
        [11 * 60 + 59, "work"],
        [11 * 60 + 41, "work"],
        [11 * 60 + 40, "rest"],
        [11 * 60 + 39, "rest"],
        [11 * 60 + 31, "rest"],
        [11 * 60 + 30, "work"],
        [11 * 60 + 29, "work"],
        [0 * 60 + 11, "work"],
        [0 * 60 + 10, "rest"],
        [0 * 60 + 9, "rest"],
        [0 * 60 + 0, "workout_complete"],
    ].forEach(([time, state]) => {
        console.log(`${formatTime(time as number)} => ${state} ?`);
        expect(tlh.stateAt(time as number)).toEqual(state);
    });
  });
  test('kegel config', () => {
    const tlh = new TabataLogicHelper({
        exercisesPerRound: 1,
        numberOfRounds: 8,
        secondsPerExercise: 6,
        secondsOfRest: 2
    });
    expect(tlh.startSeconds()).toEqual(64);
    // time, state
    [
        [65, "rest"],
        [64, "work"],
        [63, "work"],
        [62, "work"],
        [61, "work"],
        [60, "work"],
        [59, "work"],
        [58, "rest"],
        [57, "rest"],
        [56, "work"],
        [1, "rest"],
        [0, "workout_complete"],
    ].forEach(([time, state]) => {
        console.log(`${formatTime(time as number)} => ${state} ?`);
        expect(tlh.stateAt(time as number)).toEqual(state);
    });
  });
});
