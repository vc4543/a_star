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
	var problem : QueensSearch = new QueensSearch(state);
        if(Searcher.search(problem))
            return planFor(problem.currentState, state);
        plan.push("Moving right as I couldnt finish ");
        plan.push("r");
        return plan;
    }

    class QueensSearch implements Searcher.searchInterface {
        constructor(
            public aState: PuzzleState
        ) {this.currentState = clone(aState); this.currentState.InitialCost = 0; console.log('start');}

        public currentState : PuzzleState;
        private frontier : PuzzleState[] = [];

        getCostOfCurrentState(): number {
	        var cost : number = 0;
	        for(var i = 0; i < this.currentState.stacks.length; i++)
	            if(this.isAttacked(this.currentState, i, this.currentState.stacks.length))
	                ++cost; // You have to move it if its attacked
	        return cost;
        }
        isGoalCurrentState(): Boolean {
            for(var i = 0; i < this.currentState.stacks.length; i++)
                if(this.isAttacked(this.currentState, i, this.currentState.stacks.length))
                    return false;
            return true;
        }

        saveCurrentStateIntoFrontier(): void {this.frontier.push(this.currentState);}

        nextChildAndMakeCurrent(): Boolean {
            var solvingI = this.currentState.InitialCost + 1;
            for(var i=0; i <= solvingI; ++i)
                if(this.currentState.stacks[solvingI].length == 0) {
                    console.log('skipping one');
                    solvingI++;
                }
            this.currentState = clone(this.currentState);
            this.currentState.InitialCost = solvingI;
            if(this.currentState.InitialCost>this.currentState.stacks.length) {
                console.log('out of stack length');
                return false;
            }
            return this.nextSiblingAndMakeCurrent();
        }

        nextSiblingAndMakeCurrent(): Boolean {
            var aState : PuzzleState = clone(this.currentState);
            var solvingI = this.currentState.InitialCost;
            for(var j = aState.stacks[solvingI].length; j < 8; j++) {
                aState.stacks[solvingI].push("x");
                if(!this.canBeAttacked(aState, solvingI)) { //prune
                    this.currentState = aState;
                    return true;
                }
            }
            return false;
        }

        deleteFrontierElement(inx: number): void {this.frontier.splice(inx,1);}

        setCurrentStateFromFrontier(inx: number): void {this.currentState=this.frontier[inx];}

        maximumCostValue(): number {return 10000;}
        frontierSize(): number {return this.frontier.length;}

        printDebugInfo(info : string) : void {console.log(info);}

        canBeAttacked(state : PuzzleState, i:number): Boolean {
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

        isAttacked(state : PuzzleState, i:number, mx:number): Boolean {
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
