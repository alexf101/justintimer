export type TabataConfig = {
    exercisesPerRound: number;
    numberOfRounds: number;
    secondsPerExercise: number;
    secondsOfRest: number;
}
export type TabataState = "work" | "rest" | "workout_complete";

class Round {
    stateAt(timeSeconds: number): TabataState {
        if (timeSeconds <= this.rest) {
            return "rest";
        } else {
            return "work";
        }
    }
    rest: number;
    work: number;
    constructor(rest: number, work: number) {
        this.rest = rest;
        this.work = work;
    }
    toJSON() {
        return {
            rest: formatTime(this.rest),
            work: formatTime(this.work),
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
        for (let round=0; round<this.numberOfRounds; round+=1) {
            let r=[];
            for (let exercise=0; exercise<this.exercisesPerRound; exercise+=1) {
                let restAt = secondsTotal + this.secondsOfRest;
                let workAt = restAt + this.secondsPerExercise;
                this.rounds.push(new Round(restAt, workAt));
                secondsTotal = workAt;
            }
        }
        console.log("secondsTotal: ", secondsTotal);  // XX
        console.log("this.rounds: ", JSON.stringify(this.rounds, null, 2));  // XX
        return secondsTotal;
    }

    startSeconds() {
        return this.secondsTotal;
    }

    roundAt(timeSeconds: number): Round {
        // The round begins with work
        return this.rounds.flat().find((time) => timeSeconds <= time.work)!;
    }

    stateAt(timeSeconds: number): TabataState {
        if (timeSeconds > this.secondsTotal) {
            return "rest";
        }
        if (timeSeconds === 0) {
            return "workout_complete";
        }
        console.log("this.roundAt(timeSeconds): ", this.roundAt(timeSeconds).toJSON());  // XX
        return this.roundAt(timeSeconds).stateAt(timeSeconds);
    }
}
export function formatTime(time: number) {
    return `${Math.floor(time / 60)}:${(time % 60).toString().padStart(2, '0')}`;
}