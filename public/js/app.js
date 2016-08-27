var jsonEditor = CodeMirror.fromTextArea(document.getElementById("myTextarea"), {
    lineNumbers: true,
    mode: "javascript"
});

var yamlEditor = CodeMirror.fromTextArea(document.getElementById("myTextarea2"), {
    mode: "yaml"
});

class MainController {

    processJSON() {
        var jsonString = jsonEditor.getValue();
        console.info(jsonString);
        if (this.tryParseJSON(jsonString) === true) {
            console.info(true);
            this.statusMessage = "Valid json ✔";
            this.status = "success";
            var json = JSON.parse(jsonString);
            var x = stringify(json);
            console.log(x);
            yamlEditor.setValue(x);

        } else {
            this.statusMessage = "Error with JSON";
            this.status = "error";
        }
    }
    tryParseJSON(jsonString) {
        try {
            var o = JSON.parse(jsonString);
            if (o && typeof o === "object") {
                return true;
            }
        } catch (e) {
            console.error(e, jsonString);
            return false;
        }

        return false;
    };
}

angular
    .module("swagger-toolbox", [])
    .controller('mainController', MainController);