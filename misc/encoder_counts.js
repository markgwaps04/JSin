/**
 * @author Mark Anthony Libres
 **/
import {Ajax} from "../../scripts/mark.js";
import {Validation} from "../../script.js";
import {ofJSON} from "../../script";


class logs_count {


    #RequestUrl = "/pds/log";

    #responseProperties = [
        "count",
        "date",
        "total"
    ];

    constructor(callback = new Function()) {

        if(Validation.typeOf(callback) !== "function")

            throw new Error("Parameter 1 not valid function type");

        const Ofresponse = response => callback(this.#constraint(response));

        const toServer = new Ajax(this.#RequestUrl);
        toServer.post.then(Ofresponse);


    }



    #constraint = function(dataFromAjax) {

        if(Validation.typeOf(dataFromAjax) !== "object")

            throw new Error("Response not valid object type");

        const valid = ofJSON.checkAttributes(dataFromAjax,this.#responseProperties);

        if(!valid)

            throw new Error("Response not valid format JSON type");

        return dataFromAjax;


    }

}


export class encoder_logs {

    constructor() {


    }


    static get count() {

        return new Promise(resolve => new logs_count(resolve));


    }


}