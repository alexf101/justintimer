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
        [11 * 60 + 59, "work"],
        [11 * 60 + 41, "work"],
        [11 * 60 + 39, "rest"],
    ].forEach(([time, state]) => {
        console.log(`${formatTime(time as number)} => ${state} ?`);
        expect(tlh.stateAt(time as number)).toEqual(state);
    });
  });
});
