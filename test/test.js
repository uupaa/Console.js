var ModuleTestConsole = (function(global) {

return new Test("Console", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true,
    }).add([
//ok    testConsoleLogs,
        testConsoleColor,
        testConsoleSource,
        testConsoleLink,
    ]).run().clone();

/* ok
function testConsoleLogs(next) {
    Console.log("log");
    Console.warn("warn");
    Console.error("error");

    if ( 1 ) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}
 */

function testConsoleColor(next) {
    Console.color("RED", "red color");

    if ( 1 ) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testConsoleSource(next) {
    Console.source(Console.source + "", "body");

    if ( 1 ) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

function testConsoleLink(next) {
    Console.link("http://example.com/", "Example");

    if ( 1 ) {
        next && next.pass();
    } else {
        next && next.miss();
    }
}

})((this || 0).self || global);

