/// <reference path="lib/collections.ts" />

module Searcher {

    export interface searchInterface {
        getMneumonicFromCurrentState(): number;
        setCurrentStateFromMneumonic(mne:number);

        getCostOfCurrentState(): number;
        isGoalCurrentState(): Boolean;

        nextChildAndMakeCurrent(): Boolean;
        nextSiblingAndMakeCurrent(): Boolean;

        maximumCostValue(): number;

        printDebugInfo(info : string) : void;
    }

    export interface frontierInterface {
        getSmallestCost(max:number): number;

        getMneumonicInInx(inx:number): number;
        getInitialCostInInx(inx:number): number;

        deleteFrontierInInx(inx:number): void;
        pushFrontierElement(initialCost:number, cost:number, mne:number): void;

        frontierSize(): number;
    }

    //////////////////////////////////////////////////////////////////////
    // exported functions, classes and interfaces/types

    export function search(space : searchInterface) : Boolean {
        var frontier : frontierInterface = new frontierQueue();
        frontier.pushFrontierElement(1,
                                     space.getCostOfCurrentState(),
                                     space.getMneumonicFromCurrentState());
        do {
            var mi = frontier.getSmallestCost(space.maximumCostValue());
            space.setCurrentStateFromMneumonic(frontier.getMneumonicInInx(mi));
            if(space.isGoalCurrentState())
                return true;
            var currentCost = frontier.getInitialCostInInx(mi);
            frontier.deleteFrontierInInx(mi);
            if(space.nextChildAndMakeCurrent()) {
                ++currentCost;
                frontier.pushFrontierElement(currentCost,
                                             space.getCostOfCurrentState(),
                                             space.getMneumonicFromCurrentState());
                while(space.nextSiblingAndMakeCurrent())
                    frontier.pushFrontierElement(currentCost,
                                                 space.getCostOfCurrentState(),
                                                 space.getMneumonicFromCurrentState());
            } else
                space.printDebugInfo('no children');
        } while(frontier.frontierSize() > 0);
        space.printDebugInfo('No more frontier to traverse');
        return false;
    }

    export class Error implements Error {
        public name = "Searcher.Error";
        constructor(public message? : string) {}
        public toString() {return this.name + ": " + this.message}
    }


    //////////////////////////////////////////////////////////////////////
    // private functions and classes
    class frontierQueue implements Searcher.frontierInterface {
        private initialCost : number[] = [];
        private cost : number[] = [];
        private frontier : number[] = [];

        getSmallestCost(max:number): number {
var x = new collections.Set<number>(); 
x.add(123);
           var mi = 0;
           var mn = max;
           for (var i = 0; i < this.cost.length; i++)
                if(this.cost[i] < mn) {
                        mn = this.cost[i];
                        mi = i;
                }
           return mi;
        }
        deleteFrontierInInx(inx:number): void {
            this.frontier.splice(inx,1);
            this.initialCost.splice(inx,1);
            this.cost.splice(inx,1);
        }
        pushFrontierElement(initialCost:number, cost:number, mne:number): void {
            this.frontier.push(mne);
            this.initialCost.push(initialCost);
            this.cost.push(cost);
        }

        getMneumonicInInx(inx:number): number   {return this.frontier[inx];}
        getInitialCostInInx(inx:number): number {return this.initialCost[inx];}
        frontierSize(): number                  {return this.frontier.length;}
    }

}
