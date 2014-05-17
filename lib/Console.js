(function(global) {
"use strict";

// --- dependency module -----------------------------------
// --- local variable --------------------------------------
var _inNode = "process" in global;
var _inBrowser = "document" in global;
var _stylish = _isEnabledStyle();

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
Console["color"]  = Console_color;  // Console.color(...:Any):void
Console["source"] = Console_source; // Console.source(code:String, hint:String = "", style:Object = null):void
Console["link"]   = Console_link;   // Console.link(url:String, title:String = "", style:Object = null):void

// --- implement -------------------------------------------
function Console_log() {
    if (global["console"]) {
        console.log.apply(console, arguments);
    }
}

function Console_warn() {
    if (global["console"]) {
        console.warn.apply(console, arguments);
    }
}

function Console_error() {
    if (global["console"]) {
        console.error.apply(console, arguments);
    }
}

function Console_color(color,     // @arg ColorString:
                       message) { // @arg String:
    if (!global["console"]) {
        if (_stylish) {
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
}

function Console_source(code,    // @arg String:
                        hint,    // @arg String(= ""):
                        style) { // @arg Object(= null): { syntax, comment, literal, highlight }
                                 //     style.syntax - String(= "color:#03f"):
                                 //     style.comment - String(= "color:#3c0"):
                                 //     style.literal - String(= "color:#f6c"):
                                 //     style.highlight - String(= "background:#ff9;font-weight:bold"):
    hint  = hint  || "";
    style = style || {};

    var syntax    = style["syntax"]    || "color:#03f";
    var comment   = style["comment"]   || "color:#3c0";
    var literal   = style["literal"]   || "color:#f6c";
    var highlight = style["highlight"] || "background:#ff9;font-weight:bold";

    if (global["console"]) {
        if (_stylish) {
            var body = _stylishCode(code, hint,
                                    syntax, comment, literal, highlight);

            console.log.apply(console, body);
        } else {
            console.log(code);
        }
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
            "\\Wfunction\\W",   // function
            "\\Wvar\\W",        // var
            "\\Wthis\\W",       // this
            "\\Wself\\W",       // self
            "\\Wthat\\W",       // that
            "\\Wreturn\\W",     // return
            "\\Wif\\W",         // if
            "\\Welse\\W",       // else
            "\\Wtypeof\\W",     // typeof
            "\\Winstanceof\\W", // instanceof
            "\\Win\\W",         // in
            "\\Wnull\\W",       // null
            "\\Wundefined\\W",  // undefined
            "\\Wtry\\W",        // try
            "\\Wcatch\\W"       // catch
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
                } else if (/^\W(function|var|this|self|that|return|if|else|typeof)\W$/.test(match)) {
                    style.push(syntaxStyle, "");
                    return "%c" + match + "%c";
                } else if (/^\W(instanceof|in|null|undefined|try|catch)\W$/.test(match)) {
                    style.push(syntaxStyle, "");
                    return "%c" + match + "%c";
                }
                return match;
            }).trim();
    return [body].concat(style);
}

function Console_link(url,     // @arg URLString:
                      title,   // @arg String(= ""):
                      style) { // @arg Object: { link, mark }
                               //   style.link - String(= "border-bottom:2px solid #9ff"):
                               //   style.mark - String(= "▶"):
    title = title || "";
    style = style || {};

    var linkStyle = style["link"] || "border-bottom:2px solid #9ff";
    var mark      = style["mark"] || "\u25b6";

    if (global["console"]) {
        if (_stylish) {
            var link = _stylishLink(url, title, linkStyle, mark);

            console.log.apply(console, link);
        } else {
            console.log(title + url);
        }
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

function _isEnabledStyle() {
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

