(function(global) {
"use strict";

// --- dependency module -----------------------------------
// --- local variable --------------------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- define ----------------------------------------------
var CONSOLE_COLORS = {
        BLACK:  "\u001b[30m",
        RED:    "\u001b[31m",
        GREEN:  "\u001b[32m",
        YELLOW: "\u001b[33m",
        BLUE:   "\u001b[34m",
        MAGENTA:"\u001b[35m",
        CYAN:   "\u001b[36m",
        WHITE:  "\u001b[37m",
        CLEAR:  "\u001b[0m"
    };

// --- interface -------------------------------------------
function Console() {
}

Console["repository"] = "https://github.com/uupaa/Console.js";

Console["log"]    = Console_log;    // Console.log(...:Any):void
Console["warn"]   = Console_warn;   // Console.warn(...:Any):void
Console["error"]  = Console_error;  // Console.error(...:Any):void
Console["color"]  = Console_color;  // Console.color(color:ColorString, message:String):void
Console["link"]   = Console_link;   // Console.link(url:String, title:String = "", style:Object = null):void
Console["isEnabledStyle"] = Console_isEnabledStyle; // Console.isEnabledStyle():Boolean

if (!global["console"]) { // polyfill WorkerConsole.
    global["console"] = function() {};
    global["console"]["log"] = function() {};
    global["console"]["warn"] = function() {};
    global["console"]["error"] = function() {};
}

// --- implement -------------------------------------------
function Console_log() {
    console.log.apply(console, arguments);
}

function Console_warn() {
    console.warn.apply(console, arguments);
}

function Console_error() {
    console.error.apply(console, arguments);
}

function Console_color(color,     // @arg ColorString
                       message) { // @arg String
    if ( Console_isEnabledStyle() ) {
        color = color.toUpperCase();
        if (color in CONSOLE_COLORS) {
            console.log("%c" + message, "color:" + color, "");
        }
    } else if (_runOnNode) {
        color = color.toUpperCase();
        if (color in CONSOLE_COLORS) {
            console.log(CONSOLE_COLORS[color] + message + CONSOLE_COLORS.CLEAR);
        }
    } else {
        console.log(message);
    }
}

function Console_link(url,     // @arg URLString
                      title,   // @arg String = ""
                      style) { // @arg Object - { link, mark }
                               // @style.link String = "border-bottom:2px solid #9ff"
                               // @style.mark String = "▶"
    title = title || "";
    style = style || {};

    var linkStyle = style["link"] || "border-bottom:2px solid #9ff";
    var mark      = style["mark"] || "\u25b6";

    if ( Console_isEnabledStyle() ) {
        console.log.apply( console, _stylishLink(url, title, linkStyle, mark) );
    } else {
        console.log(title + url);
    }
}

function _stylishLink(url, title, linkStyle, mark) {
    if (!/%/.test(url)) {
        var link = "";

        if (title) {
            link = mark + " " + title + "\n    %c" + url + "%c";
        } else {
            link = "%c" + url + "%c";
        }
        return [link].concat([linkStyle, ""]);
    }
    return [title, url];
}

function Console_isEnabledStyle() { // @ret Boolean
    if (global["navigator"]) {
        if ( /Chrome/.test( global["navigator"]["userAgent"] || "" ) ) {
            if (_runOnBrowser) {
                return true;
            }
        }
    }
    return false;
}

// --- export ----------------------------------------------
if ("process" in global) {
    module["exports"] = Console;
}
global["Console" in global ? "Console_" : "Console"] = Console; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom

