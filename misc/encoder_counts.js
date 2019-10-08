class pds_table
{

    target =  String("pdsTable")
        ._getId(true);

    dataTable = null;

    constructor(data,func = new Function)
    {

        if(Validation.typeOf(func) !== "function")

            throw new Error("Parameter 2 not valid callback");


        this.destroy();

        const config = {

            responsive : true,
            "deferRender": true,
            "dom": 'Bfrtip',

            "buttons" : [
                {
                    "extend": 'copyHtml5',
                    "exportOptions": {
                        "columns": [ 0, ':visible' ]
                    }
                },

                {
                    "extend": 'excelHtml5',
                    "exportOptions": {
                        "columns": ':visible'
                    }
                },
                {
                    "extend": 'pdfHtml5',
                    "title": 'Digos City PDS Lists',
                    "orientation": 'landscape',
                    "exportOptions": {
                        "columns": [ 1, 2, 3, 4, 5 ]
                    }
                },
                'colvis'
            ],

            "columnDefs" : [

                {
                    "targets": [ 0 ],
                    "orderable": false,
                },
                {
                    "targets": [ -1 ],
                    "orderable": false,
                },

            ],

            "data" : data,
            "initComplete" : func

        };

        this.dataTable = this
            .target
            .DataTable(config);


    }


    destroy()
    {

        const hasBeenInit = $.fn.dataTable.isDataTable(this.target);

        if(!hasBeenInit) return;

        //this.dataTable.destroy();

        this
            .target
            .DataTable()
            .destroy();

    }


}


class formatting_response_from_ajax
{

    #actionTemplate = employee_pds
        .pds_list_action
        .table_action()
        ._noDoubleSpace();


    #mark_employee_name_template = employee_pds
        .pds_list_action
        .isContracted();


    #requestParams = [
        "name",
        "Birthday",
        "Sex",
        "CivilStatus",
        "eligibility",
        "skills",
        "Cellphone",
        "Telephone",
        "isContracted"
    ];



    _filterData = function(data_array) {

        const array = Array
            .from(data_array)
            .filter(item_json => ofJSON.checkAttributes(item_json,this.#requestParams));

        if(data_array.length !== array.length)

            warning("Some data is not proper format");

        return array;

    }


    init(data)
    {

        const root = this;
        data = this._filterData(data);

        return data.map(function (perData,index) {


            const array = [];

            const name = perData.name,
                birthday = perData.Birthday || NOTHING,
                sex = perData.Sex || NOTHING,
                civil_status = perData.CivilStatus || NOTHING,
                eligibility = perData.eligibility || NOTHING,
                skills = perData.skills || NOTHING,
                telephone = (perData.Telephone ? ", "+ (perData.Telephone) : ""),
                contact = (perData.Cellphone || NOTHING) + telephone;

            let action = ofString.parser(root.#actionTemplate,perData);
            const isContracted = "";

            return w.array(
                name,
                birthday,
                sex,
                civil_status,
                eligibility,
                skills,
                contact,
                action);


        });

    }


}



class pds_list extends formatting_response_from_ajax
{

    #requestURL = "/pds/getEmployees";

    #response = function(response)
    {

        const isArray = ofArray.isValid(response);

        if(!isArray)

            throw new Error("Not valid array response format : " + response);

        let data = ofString.parseType(response);

        return data;

    };

    send() {

        const root = this;

        return new Promise(function (resolve) {

            w
                .jQuery
                .post(attr.requestURL,EMPTY_OBJECT,function (response)
                {

                    response = root.#response(response);
                    const formated = root.init(response);
                    resolve(formated);

                });

        });


    }


}



class block_state
{

    #state = null;

    #id = null;

    #blockURL = "/pds/block_state";

    constructor(id,state)
    {
        this.#id = id;
        this.#state = state;
    }

    #afterSucess = function ()
    {

        const root = this;

        this._element_row_td.css("background","#f9dda96e");

        const whenPressOk = function() {

            root._element_row_td
                .animate({ padding: 0 })
                .wrapInner('<div />')
                .children()
                .slideUp(function() {

                    root
                        ._element_row_td
                        .closest('tr')
                        .remove();

                });

        }

        swal({
            title: "Success",
            text: "Successfully added to the block list",
            icon: "success",
            className: "swal-custom-style",
            confirm: {
                text: "OK",
                value: true,
                visible: true,
                className: "",
                closeModal: true
            }
        }).then(whenPressOk);


    }

    #respond = function (result)
    {

        const root = this;

        const type = Validation.typeOf(result);
        const stringfy = JSON.stringify(result);

        switch (true) {

            case type === "number":

                const convert_to_Type = stringfy._parseType();

                if(convert_to_Type <= 0) warning("No data has been changed");

                this.#afterSucess();

                break;

            default:

                throw new Error("Invalid response from server : " + type + " : " + result);

                break;

        }


    }

    send() {

        const params = {id : this.#id};

        const sendURL = ofString.concat(this.#blockURL,"/",this.#state);

        w
            .jQuery
            .post(sendURL,params, (respond) => this.#respond(respond));

    }


}


class block extends block_state{

    _element_trigger = null;

    _element_row_td = null;

    constructor(id,element) {

        super(id,"block_pds");
        this._element_trigger = element;
        this._element_row_td = Element.jQuery(element)
            .parents("tr")
            .children('td, th');

        this.send();

    }

}


class action
{

    main() {

        const root = this;

        this
            ._target_container
            .find("button,li")
            .off("click")
            .on("click",function () {

                let id = this.getAttribute("id");

                if(!id) return warning("action type has no identifier");

                id = "_" + String(id).trim();

                if(typeof root[id] !== "function") return;

                root[id](this);

            });

    }

}


class table_action extends action
{

    _target_name = "table_action";

    _target_container = this._target_name._getTag(true);

    #parent = function(element)
    {

        element = Element.jQuery(element);
        let parent = element.parents(this._target_name);
        parent = ofArray.first(parent);

        if(!parent) throw new Error("Could not find parent of an target element");

        return Element.jQuery(parent);

    }


    #getId = function(target) {

        const user_identifier = this
            .#parent(target)
            .attr("id") ||  null;

        /**
         * @todo please aware of this,
         * @deprecated future errors such as the target element
         * has no identifier
         * @data could unformatted
         *
         * **/

        if(!user_identifier) throw new Error("Could not find identifier");

        return user_identifier;

    }

    _editPDS(element)
    {

        /** initialized after page loaded **/

        init.main();

    }

    _blockPDS(element)
    {

        const id = this.#getId(element);

        const init_block = new block(id,element);

        /** initialized after page loaded **/

        // init.main();

    }

}


class rightside_buttons extends action
{

    #table = null;

    _target_container = "rightside_buttons"._getTag(true);

    constructor(data) {
        super()
    }

    _btnRefresh() {

        /** initialized after page loaded **/

        init.main();

    }

    _btnUsersTotal() {

        $.ajax({
            url : "/pds/users_encoded",
            type: "GET",
            success: function(data)
            {

                $('#userModal').modal('show');

            },
            error: function (jqXHR, textStatus, errorThrown){

                alert('Error get data from ajax');
            }
        });

    }

    _btnPrint()  { window.location.href= '/pds/printpds' }

    _btnAdd()  { window.location.href= '/pds/newPds' }


}


class init
{

    static main()
    {
        const ajax = new pds_list();
        const dataReady = ajax.send();

        return new Promise(function (resolve) {

            dataReady.then(function (formated) {

                const table = new pds_table(formated,function () {

                    const table_buttons_action = new table_action();
                    table_buttons_action.main();

                });

            });

        });

    }

}


Page.ready(function ()
{

    Template_render.init(function ()
    {

        import("../scripts/misc/encoder_counts.js").then(scope);

        const promise = require_src({
            "/vendor/datatables/datatables/media/js/jquery.dataTables.js" : "$.fn.DataTable",
            "/support/js/plugins/sweetalert/sweetalert.min.js" : "sweetAlert"
        });


        /** @end of include **/

        promise.then(function ()
        {

            const rightside_action = new rightside_buttons();
            rightside_action.main();

            init.main();

        });

    });



});