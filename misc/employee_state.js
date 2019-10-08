

export class pds_state
{

    #state = null;

    #id = null;

    #blockURL = "/pds/employee_state";

    constructor(id,state)
    {
        this.#id = id;
        this.#state = state;
    }


    /**
     * @param result int
     */

    #respond = function (result)
    {

        const root = this;

        const type = Validation.typeOf(result);
        const stringfy = JSON.stringify(result);

        if(type !== 'number')

            throw new Error("Invalid response from server : " + type + " : " + result);


        const convert_to_Type = stringfy._parseType();

        if(convert_to_Type <= 0) warning("No data has been changed");

    };

    send(callBack = new Function) {

        const root = this;

        const params = {id : root.#id},
            sendURL = ofString.concat(root.#blockURL,"/",root.#state);


        window
            .jQuery
            .post(sendURL,params, function (respond) {
                root.#respond(respond);
                callBack(respond);
            });

    }


}


export class block extends pds_state
{

    constructor(id) {

        super(id,"block");

    }

}


export class approved_pds extends pds_state
{
    constructor(id) {

        super(id,"approved");

    }
}