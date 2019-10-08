
export class ofDataTable {

    #element = null;
    #initElement = null;

    #defaultConfig = {
        "responsive" : true,
        "deferRender": true,
        "dom": 'Bfrtip',
        "buttons":[
            {"extend":'copyHtml5',"exportOptions":{"columns":[0,':visible']}},
            {"extend":'excelHtml5',"exportOptions":{"columns":':visible'}},
            {
                "extend":'pdfHtml5',
                "orientation":'landscape',
                "exportOptions":{"columns":[1,2,3,4,5]}
            },
            'colvis'],
        "columnDefs":[
            {"targets":[0],"orderable":false,},
            {"targets":[-1],"orderable":false,}
        ]
    };


    constructor(element, config,callBack = new Function) {

        config = config || {};
        config = Object.assign(this.#defaultConfig,config);

        config = Object.assign(config,{
            "initComplete" : callBack,
            "drawCallback" : callBack
        })

        const elementType = Validation.typeOf(element);
        const configType = Validation.typeOf(config);

        if(!ofjQuery.isInit)

            throw new Error("jQuery not initialized");

        if(!ofDataTable.isBeenInitialized)

            throw new Error("DataTable not found");

        if(elementType !== "string")

            throw new Error("Invalid type of parameter 1");

        if(configType !== "object")

            throw new Error("Invalid type of parameter 2");

        this.#element = String(element)._getId(true);

        if(this.#element.length <= 0)

            throw new Error("No target element specified");

        this.destroy();

        this.#initElement = this.#element.DataTable(config);

    }

    get isDataTable() {

        return window.$.fn.dataTable.isDataTable(this.#element);

    }

    get ofApi() {

        if(!this.isDataTable)

            throw new Error("The element is not valid DataTable prototype");

        return this.#initElement;

    }

    get ofElement() {

        if(this.#element.length <= 0)

            throw new Error("No target element specified");

        return this.#element;

    }

    static get isBeenInitialized() {

        return window.$.fn.hasOwnProperty("DataTable");

    }

    /**
     * @deprecated
     * @param callback
     */

    initComplete(callback) {

        if(!this.isDataTable)

            throw new Error("The element is not valid DataTable prototype");

        if(typeof callback !== "function")

            throw new Error("Parameter 1 not valid function");

        this.#initElement.on("initComplete",callback)

    }

    destroy()
    {

        if(!this.isDataTable) return;

        this
            .#element
            .DataTable()
            .destroy();

    }


}