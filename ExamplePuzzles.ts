///<reference path="Puzzle.ts"/>

var ExamplePuzzles : {[s:string]: PuzzleState} = {};


ExamplePuzzles["8queens"] = {
    "stacks": [["a"],["b"],["c"],["d"],["e"],["f"],["g"],["h"]],
    "holding": null,
    "arm": 0,
    "objects": {
        "a": { "form":"ball",   "size":"large",  "color":"white" },
        "b": { "form":"ball",   "size":"large",  "color":"white" },
        "c": { "form":"ball",   "size":"large",  "color":"white" },
        "d": { "form":"ball",   "size":"large",  "color":"white" },
        "e": { "form":"ball",   "size":"large",  "color":"white" },
        "f": { "form":"ball",   "size":"large",  "color":"white" },
        "g": { "form":"ball",   "size":"large",  "color":"white" },
        "h": { "form":"ball",   "size":"large",  "color":"white" },
        "x": { "form":"brick",   "size":"large", "color":"green" },
    },
    "examples": [
        "solve",
//        "random",
    ]
};

ExamplePuzzles["13queens"] = {
    "stacks": [["a"],["b"],["c"],["d"],["e"],["f"],["g"],["h"],["i"],["j"],["k"],["l"],["m"]],
    "holding": null,
    "arm": 0,
    "objects": {
        "a": { "form":"ball",   "size":"large",  "color":"white" },
        "b": { "form":"ball",   "size":"large",  "color":"white" },
        "c": { "form":"ball",   "size":"large",  "color":"white" },
        "d": { "form":"ball",   "size":"large",  "color":"white" },
        "e": { "form":"ball",   "size":"large",  "color":"white" },
        "f": { "form":"ball",   "size":"large",  "color":"white" },
        "g": { "form":"ball",   "size":"large",  "color":"white" },
        "h": { "form":"ball",   "size":"large",  "color":"white" },
        "i": { "form":"ball",   "size":"large",  "color":"white" },
        "j": { "form":"ball",   "size":"large",  "color":"white" },
        "k": { "form":"ball",   "size":"large",  "color":"white" },
        "l": { "form":"ball",   "size":"large",  "color":"white" },
        "m": { "form":"ball",   "size":"large",  "color":"white" },
        "x": { "form":"brick",   "size":"large", "color":"green" },
    },
    "examples": [
        "solve",
//        "random",
    ]
};
