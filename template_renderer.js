
console.log("Hello JAVA");

export class helper {

    constructor() {

        window.Handlebars.registerHelper("ifLogic",this.#ifLogic);

    }

    #ifLogic = function(param1, logical_condition, param2, options) {

        switch (logical_condition) {
            case '==':
                return (param1 == param2) ? options.fn(this) : options.inverse(this);
            case "is" :
            case '===':
                return (param1 === param2) ? options.fn(this) : options.inverse(this);
            case '!=':
                return (param1 != param2) ? options.fn(this) : options.inverse(this);
            case '!==':
                return (param1 !== param2) ? options.fn(this) : options.inverse(this);
            case '<':
                return (param1 < param2) ? options.fn(this) : options.inverse(this);
            case '<=':
                return (param1 <= param2) ? options.fn(this) : options.inverse(this);
            case '>':
                return (param1 > param2) ? options.fn(this) : options.inverse(this);
            case '>=':
                return (param1 >= param2) ? options.fn(this) : options.inverse(this);
            case '&&':
                return (param1 && param2) ? options.fn(this) : options.inverse(this);
            case '||':
                return (param1 || param2) ? options.fn(this) : options.inverse(this);
            default:
                return options.inverse(this);
        }

    }

}


export class renderer extends helper {

    constructor() {
        super();
    }


    static parse(string,json) {

        if(! window.hasOwnProperty("Handlebars"))

            throw new Error("Template has not been initialized");

        let compiledTemplate = window.Handlebars.compile(string);

        const _template =  compiledTemplate(json);

        return _template;

    }


}