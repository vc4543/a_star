///<reference path="Puzzle.ts"/>
///<reference path="Interpreter.ts"/>
///<reference path="Searcher.ts"/>

module Planner {

    //////////////////////////////////////////////////////////////////////
    // exported functions, classes and interfaces/types

    export function plan(interpretations : Interpreter.Result[], currentState : PuzzleState) : Result[] {
        var plans : Result[] = [];
        interpretations.forEach((intprt) => {
            var plan : Result = <Result>intprt;
            plan.plan = planInterpretation(plan.intp, currentState);
            plans.push(plan);
        });
        if (plans.length) {
            return plans;
        } else {
            throw new Planner.Error("Found no plans");
        }
    }


    export interface Result extends Interpreter.Result {plan:string[];}


    export function planToString(res : Result) : string {
        return res.plan.join(", ");
    }


    export class Error implements Error {
        public name = "Planner.Error";
        constructor(public message? : string) {}
        public toString() {return this.name + ": " + this.message}
    }


    //////////////////////////////////////////////////////////////////////
    // private functions

    function planInterpretation(intprt : Interpreter.Literal[][], state : PuzzleState) : string[] {
        var plan : string[] = [];
        if(search(space : searchInterface))
            return planFor(nextState, state);
        plan.push("Moving right as I couldnt finish "+mi+" "+frontier.length);
        plan.push("r");
        return plan;
    }

    interface searchInterface {
        var currentState : PuzzleState;
        var frontier : PuzzleState[] = [];

        getCostOfCurrentState(): number {return getCostOfState(currentState)}
        isGoalCurrentState(): Boolean {return goal(currentState);}

        saveCurrentStateIntoFrontier(): void {frontier.push(currentState);};
        nextChildAndMakeCurrent(): Boolean;
        nextSiblingAndMakeCurrent(): Boolean;
        deleteFrontierElement(inx: number): void {frontier.splice(inx,1)};
        setCurrentStateFromFrontier(inx: number): void {currentState=frontier[inx];}

        maximumCostValue(): number {return 10000;}

        printDebugInfo(info : string) : void;
    }


        do {
            var solvingI = nextState.InitialCost;
            for(var i=0; i < solvingI; ++i)
                if(state.stacks[solvingI].length == 0)
                    solvingI++;
            var fl : number = frontier.length;
            var aState : PuzzleState = clone(nextState);
            ++aState.InitialCost;//path cost
            for(var j = aState.stacks[solvingI].length; j < 8; j++) {
                aState = clone(aState);
                aState.stacks[solvingI].push("x");
                if(!canBeAttacked(aState, solvingI)) { //prune
                    frontier.push(aState);
                    cost.push(getCostOfState(aState));
                }
            }

        } while(frontier.length > 0);
    }

    function planFor(nextState : PuzzleState, state: PuzzleState) {
        var plan : string[] = [];
        var statearm = state.arm;
        var pickstack = -1;
        do {
            ++pickstack;
        } while (state.stacks[pickstack].length == 0);
        while(pickstack < state.stacks.length) {
            if(state.stacks[pickstack].length != nextState.stacks[pickstack].length) {
                // First move the arm to the position
                if (pickstack < statearm) {
                    plan.push("Moving left");
                    for (var i = statearm; i > pickstack; i--) {
                        plan.push("l");
                    }
                } else if (pickstack > state.arm) {
                    plan.push("Moving right");
                    for (var i = statearm; i < pickstack; i++) {
                        plan.push("r");
                    }
                }
                statearm = pickstack;
                // Then pick up the object
                var obj = state.stacks[pickstack][state.stacks[pickstack].length-1];
                plan.push("Picking up the " + state.objects[obj].form,
                          "p");

                // Raising it up
                plan.push("Raising the " + state.objects[obj].form);
                for (var i = state.stacks[pickstack].length; i < nextState.stacks[pickstack].length; i++)
                    plan.push("a");

                // Finally put it down again
                plan.push("Dropping the " + state.objects[obj].form,
                          "d");
            }
            pickstack++;
        }
        return plan;
    }

    function getCostOfState(state : PuzzleState) {
        var cost : number = state.InitialCost
        for(var i = 0; i < state.stacks.length; i++)
            if(isAttacked(state, i, state.stacks.length))
                ++cost; // You have to move it if its attacked
        return cost;
    }

    function canBeAttacked(state : PuzzleState, i:number): Boolean {
        for(var j = 0; j < i; j++) // horizontal attacks
          if(state.stacks[j].length != 0)
            if(state.stacks[i].length == state.stacks[j].length)
                return true;
        for(var j = 0; j < i; j++) // Diagonal up
          if(state.stacks[j].length != 0)
            if(state.stacks[i].length == state.stacks[j].length + (j-i))
                return true;
        for(var j = 0; j < i; j++) // Diagonal down
          if(state.stacks[j].length != 0)
            if(state.stacks[i].length == state.stacks[j].length - (j-i))
                return true;
    }

    function isAttacked(state : PuzzleState, i:number, mx:number): Boolean {
        if(state.stacks[i].length == 0)
            return false;
        for(var j = i + 1; j < mx; j++) // horizontal attacks
          if(state.stacks[j].length != 0)
            if(state.stacks[i].length == state.stacks[j].length)
                return true;
        for(var j = i + 1; j < mx; j++) // Diagonal up
          if(state.stacks[j].length != 0)
            if(state.stacks[i].length == state.stacks[j].length + (j-i))
                return true;
        for(var j = i + 1; j < mx; j++) // Diagonal down
          if(state.stacks[j].length != 0)
            if(state.stacks[i].length == state.stacks[j].length - (j-i))
                return true;
    }

    function goal(state : PuzzleState): Boolean {
        for(var i = 0; i < state.stacks.length; i++)
            if(isAttacked(state, i, state.stacks.length))
                return false;
        return true;
    }

    function getRandomInt(max) {
        return Math.floor(Math.random() * max);
    }

    function clone<T>(obj: T): T {
        if (obj != null && typeof obj == "object") {
            var result : T = obj.constructor();
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    result[key] = clone(obj[key]);
                }
            }
            return result;
        } else {
            return obj;
        }
    }

}
