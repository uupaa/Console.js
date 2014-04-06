// @name: Console.js
// @require: none
// @cutoff: @worker

(function(global) {
"use strict";

// --- variable --------------------------------------------
var _inWorker = "WorkerLocation" in global;

// --- define ----------------------------------------------
// --- interface -------------------------------------------
function Console() { // @help: Console
}

Console["repository"] = "https://github.com/uupaa/Console.js";

Console["prototype"]["log"]   = Console_log;   // Console#log():void
Console["prototype"]["warn"]  = Console_warn;  // Console#warn():void
Console["prototype"]["error"] = Console_error; // Console#error():void

// --- implement -------------------------------------------
function Console_log() { // @help: Console#log
}

function Console_warn() { // @help: Console#warn
}

function Console_error() { // @help: Console#error
}

// --- export ----------------------------------------------
//{@worker
if (_inWorker) {
    if (global["console"]) {
        global["console_"] = new Console(); // already exsists
    } else {
        global["console"]  = new Console();
    }
}
//}@worker

})((this || 0).self || global);

