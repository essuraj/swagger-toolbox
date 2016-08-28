var jsonEditor = CodeMirror.fromTextArea(document.getElementById("myTextarea"), {
    lineNumbers: true,
    mode: "application/json",
    gutters: ["CodeMirror-lint-markers"],
    lint: true,
    lintOnChange: true
});

var yamlEditor = CodeMirror.fromTextArea(document.getElementById("myTextarea2"), {
    mode: "yaml",
    readOnly: true
});
class MainController {

    processJSON() {
        var jsonString = jsonEditor.getValue().trim();
        console.info(jsonString);
        if (this.tryParseJSON(jsonString) === true) {
            console.info(true);
            this.statusMessage = "Valid json ✔";
            this.status = "success";
            var json = JSON.parse(jsonString);
            var yamlReady = this.buildSwaggerJSON(json);
            var x = stringify(yamlReady);
            console.log(x);
            yamlEditor.setValue(x);
            this.statusMessage = "Convertion complete ✔";
            this.status = "success";

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
    }
    buildSwaggerJSON(data) {
        var keys = Object.keys(data)
        var op = { required: keys, properties: {} };
        keys.forEach(x => {
            var typeData = typeOf(data[x]);
            if (["array", "object", "null"].indexOf(typeData) === -1)
                op.properties[x] = { "type": typeData };
            else {
                switch (typeData) {
                    case "array":
                        typeData = typeOf(data[x][1]);
                        switch (typeData) {
                            case "array":
                                typeData = typeOf(data[x][1]);
                                if (["array"].indexOf(typeData) === -1) {
                                    op.properties[x] = { "type": "array", "items": { type: typeData } };
                                } else {
                                    this.statusMessage = "Error with JSON - Complex object";
                                    this.status = "error";
                                    throw new Error("Complex object", data[x]);
                                }
                                break;
                            case "object":
                                op.properties[x] = this.buildSwaggerJSON((data[x]));
                                op.properties[x].type = "object";
                                break;
                            default:
                                console.warn("skipping " + typeData);
                                break;

                        }
                        if (["array"].indexOf(typeData) === -1) {
                            op.properties[x] = { "type": "array", "items": { type: typeData } };
                        } else {
                            this.statusMessage = "Error with JSON - Complex object";
                            this.status = "error";
                            throw new Error("Complex object", data[x]);
                        }
                        break;
                    case "object":
                        op.properties[x] = this.buildSwaggerJSON((data[x]));
                        op.properties[x].type = "object";
                        break;
                    default:
                        console.warn("skipping " + typeData);
                        break;
                }



            }
        });
        return op;
    }
}

angular
    .module("swagger-toolbox", [])
    .controller('mainController', MainController);