import {
    Template
} from "../../scripts/mark.js";


export class vw_table_action extends Template {

    constructor(data) {
        super(data);
    }

    get menu_button() {

       return this._get("menu_button");

    }

}

