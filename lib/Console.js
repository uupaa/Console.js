(function(global) {
"use strict";

// --- dependency module -----------------------------------
// --- local variable --------------------------------------
var _inNode = "process" in global;
var _inBrowser = "document" in global;

// --- define ----------------------------------------------
var _CONSOLE_COLOR = {
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
Console["source"] = Console_source; // Console.source(code:String, hint:String = "", style:Object = null):void
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
        if (color in _CONSOLE_COLOR) {
            console.log("%c" + message, "color:" + color, "");
        }
    } else if (_inNode) {
        color = color.toUpperCase();
        if (color in _CONSOLE_COLOR) {
            console.log(_CONSOLE_COLOR[color] + message + _CONSOLE_COLOR.CLEAR);
        }
    } else {
        console.log(message);
    }
}

function Console_source(code,    // @arg String
                        hint,    // @arg String = ""
                        style) { // @arg Object = null { syntax, comment, literal, highlight }
                                 //     style.syntax - String = "color:#03f"
                                 //     style.comment - String = "color:#3c0"
                                 //     style.literal - String = "color:#f6c"
                                 //     style.highlight - String = "background:#ff9;font-weight:bold"
    hint  = hint  || "";
    style = style || {};

    var syntax    = style["syntax"]    || "color:#03f";
    var comment   = style["comment"]   || "color:#3c0";
    var literal   = style["literal"]   || "color:#f6c";
    var highlight = style["highlight"] || "background:#ff9;font-weight:bold";

    if ( Console_isEnabledStyle() ) {
        console.log.apply(console, _stylishCode(code, hint, syntax, comment, literal, highlight));
    } else {
        console.log(code);
    }
}

function _stylishCode(code, hint,
                      syntaxStyle, commentStyle, literalStyle, highlightStyle) {
    var style = [];
    var colorKeyword = [ // temporary implements...
            hint,
            "\/\/[^\n]+",       // // comment
            "\/[^\n\/]+\/",     // /regexp/
            "\"[^\n\"]*\"",     // "string"
            "\'[^\n\']*\'",     // 'string'
            "\\Wfunction\\W", "\\Wvar\\W", "\\Wreturn\\W",  // function,var,return
            "\\Wthis\\W", "\\Wself\\W", "\\Wthat\\W",       // this,self,that
            "\\Wif\\W", "\\Welse\\W",                       // if,else
            "\\Win\\W", "\\Wtypeof\\W", "\\Winstanceof\\W", // in,typeof,instanceof
            "\\Wnull\\W", "\\Wundefined\\W",                // null,undefined
            "\\Wtry\\W", "\\Wcatch\\W",                     // try,catch
            "\\Wswitch\\W", "\\Wcase\\W", "\\Wdefault\\W",  // switch,case,default
            "\\Wfor\\W", "\\Wwhile\\W", "\\Wdo\\W",         // for,while,do
            "\\Wbreak\\W"                                   // break
        ];

    if (!hint) {
        colorKeyword.shift();
    }

    var rex = new RegExp("(" + colorKeyword.join("|") + ")", "g");
    var body = ("\n" + code + "\n").replace(/%c/g, "% c").
                                    replace(rex, function(_, match) {
                if (match === hint) {
                    style.push(highlightStyle, "");
                    return "%c" + hint + "%c";
                } else if (/^\/\/[^\n]+$/.test(match)) {
                    style.push(commentStyle, "");
                    return "%c" + match + "%c";
                } else if (/^(\/[^\n\/]+\/|\"[^\n\"]*\"|\'[^\n\']*\')$/.test(match)) {
                    style.push(literalStyle, "");
                    return "%c" + match + "%c";
                } else if (/^\W(function|var|return|this|self|that|if|else|)\W$/.test(match) ||
                           /^\W(in|typeof|instanceof|null|undefined|try|catch)\W$/.test(match) ||
                           /^\W(switch|case|default|for|while|do|break)\W$/.test(match)) {
                    style.push(syntaxStyle, "");
                    return "%c" + match + "%c";
                }
                return match;
            }).trim();
    return [body].concat(style);
}

function Console_link(url,     // @arg URLString
                      title,   // @arg String = ""
                      style) { // @arg Object { link, mark }
                               //   style.link - String = "border-bottom:2px solid #9ff"
                               //   style.mark - String = "▶"
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
            if (_inBrowser) {
                return true;
            }
        }
    }
    return false;
}

// --- export ----------------------------------------------
if (_inNode) {
    module["exports"] = Console; // node.js
}
if (global["Console"]) {
    global["Console_"] = Console; // secondary
} else {
    global["Console"]  = Console; // primary
}

})((this || 0).self || global); // WebModule idiom

