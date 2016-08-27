var editor = CodeMirror.fromTextArea(document.getElementById("myTextarea"), {
    lineNumbers: true,
    mode: "javascript"
});

function tryParseJSON(jsonString) {
    try {
        var o = JSON.parse(jsonString);
        if (o && typeof o === "object") {
            return o;
        }
    } catch (e) {}

    return false;
};
var editor2 = CodeMirror.fromTextArea(document.getElementById("myTextarea2"), {
    lineNumbers: true,
    mode: "yaml"
});