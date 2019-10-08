/**
 * https://babeljs.io/repl/#?babili=false&browsers=&build=&builtIns=false&spec=false&loose=false&code_lz=GYVwdgxgLglg9mABACwKYBt1wBQEpEDeAUIogE6pQhlIA8AJjAG6IToCGAzpwLwBE7dKjJREg4VAC0Ad3Y0YYAOZ8AfCVIbStTlDIJFKgApxuMAEZDE9EAAd0MCOyioANIihorT9ogCecEERUMGcKehQuIIAPGB1EBHjqRE5fHVQAW0RaAHodPSUVADp1LTMQKCgEqF8bVH4yioQ-Vg5ufjYTVEQzKCQesElOEAgIVG5EMDgydMFm-m9JRk502N4BIRFVAA0chsqwNU1NHMYmNQBfIiA&debug=false&forceAllTransforms=false&shippedProposals=false&circleciRepo=&evaluate=false&fileSize=false&timeTravel=false&sourceType=module&lineWrap=true&presets=react&prettier=false&targets=&version=7.6.0&externalPlugins=
 * @type {{employee_exist_warn: (function(): *)}}
 */

export const _ele = {

    addSave: "#addsave",
    employee_exist_warn: "[data-anchor= 'employee_exist_warn']"

}


export const personal_info = {

    addSave: {

        disable: () => document.querySelector(_ele.addSave).disabled = true,
        enable: () => document.querySelector(_ele.addSave).disabled = false

    },

    employee_exist_warn: {


        render: function () {

            const root = this;

            const message = "Possible duplicate, the data you entered has exist on our system ";
            const target = _ele.employee_exist_warn

            class warning extends React.Component {

                render() {

                    const elementId = root.name + "_trigger";

                    return React.createElement("div", {className: "alert alert-warning", id: elementId},
                        React.createElement("strong", null, message), ".", React.createElement("button", {
                            type: "button",
                            className: "close btn btn-success normal",
                            "data-dismiss": "alert"
                        }, "X"));

                }
            }


            personal_info
                .addSave
                .disable();

            ReactDOM.render(
                React.createElement(warning, {toWhat: 'World'}, null),
                document.querySelector(target)
            );


        },

        remove: function () {

            personal_info
                .addSave
                .enable();

            document
                .querySelector(_ele.employee_exist_warn)
                .innerHTML = "";

        }


    },


};


export const  vw_pds = {

table_action : {

    get base() {

        return `

                <table_action id="{{userId}}">
                    <div class="input-group-btn btn-group-sm">
                        <button type="button" class="btn {button_type}  dropdown-toggle full-width"
                                data-toggle="dropdown" aria-expanded="true" id="dropdown_button">
                            <i class="fa fa-bars"></i>
                        </button>
                        <ul class="dropdown-menu left" id="list">
                            <li id="editPDS"><a><i class="fa fa-pen"></i> Edit </a></li>
                            {actions}
                        </ul>
                    </div>
                </table_action>

                `;

    },

    get approved() {

        let template = this
            .base
            .setTokens({"button_type": "btn-success"})
            .setTokens({"actions": `<li class = "divider"> </li> <li id="blockPDS"><a>Block</a></li> `})

        return template._noDoubleSpace();

    },

    get un_approved() {

        const actions = `
                    <li id="deletePDS"><a><i className="fa fa-trash"></i> Remove</a></li>
                    <li id="approvePDS"><a><i className="fa fa-check-circle text-success"></i> Approved</a></li> `;

        let template = this
            .base
            .setTokens({"button_type": "btn-default"})
            .setTokens({"actions": actions})

        return template._noDoubleSpace();


    }

}

}