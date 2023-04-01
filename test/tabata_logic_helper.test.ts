import { describe, expect, test } from "@jest/globals";
import { formatTime, TabataLogicHelper } from "libs/tabata_logic_helper";

describe("tabataLogicHelper", () => {
    describe("typical config", () => {
        test.each(
            // time, state
            [
                [12 * 60 + 1, "rest", 1, 1],
                [12 * 60 + 0, "work", 1, 1],
                [11 * 60 + 59, "work", 1, 1],
                [11 * 60 + 41, "work", 1, 1],
                [11 * 60 + 40, "rest", 1, 1],
                [11 * 60 + 39, "rest", 1, 1],
                [11 * 60 + 31, "rest", 1, 1],
                [11 * 60 + 30, "work", 1, 2],
                [11 * 60 + 29, "work", 1, 2],
                [0 * 60 + 11, "work", 8, 3],
                [0 * 60 + 10, "rest", 8, 3],
                [0 * 60 + 9, "rest", 8, 3],
                [0 * 60 + 0, "workout_complete", 8, 3],
            ]
        )('%d => %s', (time, state, round, exercise) => {
            const tlh = new TabataLogicHelper({
                exercisesPerRound: 3,
                numberOfRounds: 8,
                secondsPerExercise: 20,
                secondsOfRest: 10,
            });
            expect(tlh.startSeconds()).toEqual(12 * 60);
            expect(tlh.stateAt(time)).toEqual(state);
            expect(tlh.roundAt(time).roundNumber).toEqual(round);
            expect(tlh.roundAt(time).exerciseNumber).toEqual(exercise);
        });
    });
    describe("kegel config", () => {
        test.each(
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
            ]
        )('%d => %s', (time, state) => {
            const tlh = new TabataLogicHelper({
                exercisesPerRound: 1,
                numberOfRounds: 8,
                secondsPerExercise: 6,
                secondsOfRest: 2,
            });
            expect(tlh.startSeconds()).toEqual(64);
            console.log(`${formatTime(time as number)} => ${state} ?`);
            expect(tlh.stateAt(time as number)).toEqual(state);
        });
    });
    // Important for when user is editing the form and it goes to zero temporarily - we don't yet bother with a validity check at the form input level.
    describe("null config", () => {
        const tlh = new TabataLogicHelper({
            exercisesPerRound: 0,
            numberOfRounds: 0,
            secondsPerExercise: 0,
            secondsOfRest: 0,
        });
        expect(tlh.secondsTotal).toEqual(0);
        expect(tlh.stateAt(3)).toEqual("rest");
        const nullRound = tlh.roundAt(3);
        expect(nullRound.exerciseNumber).toEqual(0)
        expect(nullRound.roundNumber).toEqual(0)
    });
});
