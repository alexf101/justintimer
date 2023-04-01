export type TabataConfig = {
    exercisesPerRound: number;
    numberOfRounds: number;
    secondsPerExercise: number;
    secondsOfRest: number;
};
export type TabataState = "work" | "rest" | "workout_complete";

class Round {
    roundNumber: number;
    rest: number;
    work: number;
    exerciseNumber: number;
    stateAt(timeSeconds: number): TabataState {
        if (timeSeconds <= this.rest) {
            return "rest";
        } else {
            return "work";
        }
    }
    constructor(
        rest: number,
        work: number,
        roundNumber: number,
        exerciseNumber: number
    ) {
        this.rest = rest;
        this.work = work;
        this.roundNumber = roundNumber;
        this.exerciseNumber = exerciseNumber;
    }
    toJSON() {
        return {
            rest: formatTime(this.rest),
            work: formatTime(this.work),
            roundNumber: this.roundNumber,
            exerciseNumber: this.exerciseNumber,
        };
    }
}

export class TabataLogicHelper {
    exercisesPerRound: number;
    numberOfRounds: number;
    secondsPerExercise: number;
    secondsOfRest: number;
    rounds: Round[];
    secondsTotal: number;

    constructor(args: TabataConfig) {
        this.exercisesPerRound = args.exercisesPerRound;
        this.numberOfRounds = args.numberOfRounds;
        this.secondsPerExercise = args.secondsPerExercise;
        this.secondsOfRest = args.secondsOfRest;
        this.rounds = [];
        this.secondsTotal = this.setUp();
    }

    setUp() {
        let secondsTotal = 0;
        for (let round = 0; round < this.numberOfRounds; round += 1) {
            for (
                let exercise = 0;
                exercise < this.exercisesPerRound;
                exercise += 1
            ) {
                let restAt = secondsTotal + this.secondsOfRest;
                let workAt = restAt + this.secondsPerExercise;
                this.rounds.push(
                    new Round(
                        restAt,
                        workAt,
                        this.numberOfRounds - round,
                        this.exercisesPerRound - exercise
                    )
                );
                secondsTotal = workAt;
            }
        }
        return secondsTotal;
    }

    startSeconds() {
        return this.secondsTotal;
    }

    roundAt(timeSeconds: number): Round {
        // The round begins with work
        if (this.rounds.length === 0) {
            return new Round(0, 0, 0, 0);
        }
        if (timeSeconds > this.secondsTotal) {
            return this.rounds[this.rounds.length - 1];
        }
        if (timeSeconds <= 0) {
            return this.rounds[0];
        }
        return this.rounds.find((time) => timeSeconds <= time.work)!;
    }

    stateAt(timeSeconds: number): TabataState {
        if (timeSeconds > this.secondsTotal) {
            return "rest";
        }
        if (timeSeconds === 0) {
            return "workout_complete";
        }
        return this.roundAt(timeSeconds).stateAt(timeSeconds);
    }
}
export function formatTime(time: number) {
    return `${Math.floor(time / 60)}:${(time % 60)
        .toString()
        .padStart(2, "0")}`;
}
