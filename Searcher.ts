module Searcher {

    export interface searchInterface {
        getCostOfCurrentState(): number;
        isGoalCurrentState(): Boolean;

        saveCurrentStateIntoFrontier(): void;
        nextChildAndMakeCurrent(): Boolean;
        nextSiblingAndMakeCurrent(): Boolean;
        deleteFrontierElement(inx: number): void;
        setCurrentStateFromFrontier(inx: number): void;

        maximumCostValue(): number;
        frontierSize(): number;

        printDebugInfo(info : string) : void;
    }

    //////////////////////////////////////////////////////////////////////
    // exported functions, classes and interfaces/types

    export function search(space : searchInterface) : Boolean {
        var mi = 0;

        space.saveCurrentStateIntoFrontier();
        var cost : number[] = [space.getCostOfCurrentState()];
        var initialCost : number[] = [1]; //initial path cost

        do {
           var mn = space.maximumCostValue();
           for (var i = 0; i < cost.length; i++)
                if(cost[i] < mn) {
                        mn = cost[i];
                        mi = i;
                }
            space.setCurrentStateFromFrontier(mi);
            if(space.isGoalCurrentState())
                return true;
            var currentCost = initialCost[mi];
            space.deleteFrontierElement(mi);
            initialCost.splice(mi,1);
            cost.splice(mi,1);
            if(space.nextChildAndMakeCurrent()) {
                ++currentCost;
                initialCost.push(currentCost);
                space.saveCurrentStateIntoFrontier();
                cost.push(space.getCostOfCurrentState());
                while(space.nextSiblingAndMakeCurrent()) {
                    initialCost.push(currentCost);
                    space.saveCurrentStateIntoFrontier();
                    cost.push(space.getCostOfCurrentState());
                }
            } else
                space.printDebugInfo('no children');
        } while(space.frontierSize() > 0);
        space.printDebugInfo('No more frontier to traverse');
        return false;
    }

    export class Error implements Error {
        public name = "Searcher.Error";
        constructor(public message? : string) {}
        public toString() {return this.name + ": " + this.message}
    }


    //////////////////////////////////////////////////////////////////////
    // private functions


}
