
import {
    renderer
} from "../scripts/template_renderer.js";

import {Validation,ofObject} from "../script.js";


/**
 * @author Mark Anthony Libres
 * @github markgwaps04
 */


export class Event
{

    _target_container = null;

    #elements = null;

    trigger_element = null;

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
        this.trigger_element = target;

        let id = target.getAttribute("id");
        if(!id) return warning("action type has no identifier");

        id = trigger + "_" + String(id).trim();
        if(typeof this[id] !== "function") return;

        this[id](target,thisFunc,trigger);

    }


}


export class OfHandlebars
{

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



class AJAX_STATE {

    static INVALID_REQUEST = 0;
    static CONNECTION_ESTABLISHED = 1;
    static REQUEST_RECEIVED = 2;
    static PROCESSING_REQUEST = 3;
    static REQUEST_FINISHED = 4;

}


class AJAX_REQUEST_STATUS {

    static OK = 200;


}


export class Ajax
{

    #url = null;
    #parameters = NOTHING;

    async = true;

    constructor(url,object = new Object())
    {

        if(Validation.typeOf(object) !== "object")

            throw new Error("Parameter 2 not valid object type");

        if(Validation.typeOf(url) !== "string")

            throw new Error("Parameter 1 not valid string type");

        this.#url = url;
        this.#parameters = ofObject.serialize(object);

    }

    #readyState = function(xhttp,callback) {

        xhttp = xhttp.target;

        const request_state =  xhttp.readyState ==  AJAX_STATE.REQUEST_FINISHED;
        const request_status = xhttp.status == AJAX_REQUEST_STATUS.OK;

        const response = String(xhttp.responseText)._parseType();

        if(request_state && request_status)

            callback(response,xhttp);



    }


    #send = function(callback = new Function) {


        if(Validation.typeOf(callback) !== "function")

            throw new Error("Parameter 1 not valid function");


        const xhttp  = Ajax.XMLHttpRequest;

        xhttp.onreadystatechange = Ofxhttp => this.#readyState(Ofxhttp,callback);

        return xhttp;


    }


    static get XMLHttpRequest()
    {

        if (window.XMLHttpRequest)
            // code for modern browsers
            return new XMLHttpRequest();

        // code for old IE browsers
        return new ActiveXObject("Microsoft.XMLHTTP");

    }


    get post()
    {

        const root = this;

        return new Promise(function (resolve) {

            const xhttp = root.#send(resolve)
            xhttp.open("POST",root.#url, root.async);
            xhttp.send(root.#parameters);

        });


    }

}