
/**
 * @author Mark Anthony Libres
 */



import {
    form,
    ofString,
    JSON,
    React
} from '../script.js';


import {
    personal_info
} from '../scripts/template.js';


export const _attributes = {

    form : "form#personalInfo",

    form_name : {

        firstname : "firstname",
        middlename : "middlename",
        surname : "surname",
        birthdate : "birthdate"

    },


    request : {

        isExist : "/pds/checkIfExist"

    }


};


(function (w,_) {


    const anchor = w.jQuery("[data-anchor='trigger_on_keyup']");

    /** initialize react **/

    React.ready.then(function () {


        anchor.on("change",function (value)
        {

            const personalInfo_identity = _attributes.form;
            const personalInfo_query = document.querySelector(personalInfo_identity);
            const user_input = form.serialize(personalInfo_query,true);
            const form_name = _attributes.form_name;

            const request = {

                get data() {

                    let input_attr = JSON.only( user_input, [
                        form_name.firstname,
                        form_name.middlename,
                        form_name.surname,
                        form_name.birthdate
                    ]);

                    input_attr = JSON.removeEmptyValues(input_attr);

                    return input_attr;

                },

                respond : function(result)
                {
                    result = ofString.parseType(result);

                    personal_info.employee_exist_warn.remove();

                    if(!ofString.isEmpty(result) && typeof result === "string")

                        throw new Error(result);

                    if(!result) return;

                    personal_info
                        .employee_exist_warn
                        .render();

                },

                send : function ()
                {

                    const data = this.data;

                    if(Object.keys(data).length !== 4) return;
                    const request = _attributes.request;

                    _.post(request.isExist,data, this.respond);

                }


            };

            request.send();



        });

    });


})(!this ? window : this,
    window.hasOwnProperty("jQuery") ? window.jQuery : document );