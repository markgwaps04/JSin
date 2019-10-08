
import {
    renderer
} from "../scripts/template_renderer.js"

/**
 * @author Mark Anthony Libres
 * @github markgwaps04
 */


export class Event
{

    _target_container = null;

    #elements = null;

    constructor(...elements)
    {

        const root = this;
        this._target_container = String(this.constructor.name)._getTag(true);
        this.#setElements(elements);
        this.#trigger(
            "click",
            "hover",
            "mouseover",
            "mouseout"
        );

    }


    get root_base() {

        if(!this._target_container)

            throw new Error("The tearget root not specified");

        return this._target_container;

    }


    get name() {

        return this.constructor.name;

    }

    #setElements = function (array) {

        let element = array.join(",");

        this.elements =  this
            ._target_container
            .find(element);

    }

    #trigger = function (...args) {

        const root = this;

        args.forEach(function (trigger) {

            root.elements
                .off(trigger)
                .on(trigger,e => root.#action(e,trigger));

        });

    }

    #action = function (thisFunc,trigger) {

        const target = thisFunc.currentTarget;

        let id = target.getAttribute("id");
        if(!id) return warning("action type has no identifier");

        id = trigger + "_" + String(id).trim();
        if(typeof this[id] !== "function") return;

        this[id](target,thisFunc,trigger);

    }


}


export class OfHandlebars {

    #src = "/support/js/plugins/handlebars.js";

    #contructor_callback = null;

    constructor(callBack = new Function) {

        this.#contructor_callback = callBack;

        if(this.isHandleBarsInit)

            return this.#afterInitialize();

        import(this.#src).then(() => this.#afterInitialize())

    }

    #afterInitialize = function() {

        const template_render = new renderer();

        this.#contructor_callback();

        /**
         * No return value
         * is it bug of ecmascript6 ?
         */

        // return template_render;

    }

    get isHandleBarsInit() {

        if(! window.hasOwnProperty("Handlebars"))

            return false;

        return true;

    }

}


export class Template extends OfHandlebars
{

    #data = null;

    renderer = renderer

    constructor(data) {

        super();
        this.#data = data;

    }

    _get(string_method, parseAfter = true) {

        const query = String(this.constructor.name) + ":" + string_method;
        const element = query._getDataAnchor(true);

        if(element.length <= 0)

            throw new Error("Template not found!");

        const temp_string =  element.html();

        if(!parseAfter)

            return temp_string;

        return renderer
            .parse(temp_string,this.#data)
            ._noDoubleSpace();

    }


    static get init() {

        return new Promise(function (resolve, reject) {

            const handlebar = new OfHandlebars(resolve)

        });


    }

}