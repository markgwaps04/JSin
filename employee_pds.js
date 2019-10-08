/**
 * @author Mark Anthony Libres
 */


import {Element, ofArray, ofjQuery, ofJSON, ofObject, ofString, Page, require_src, Validation} from '../script.js';

import {Event, Template, Ajax} from "../scripts/mark.js";


import {approved_pds, block, remove_pds} from "./misc/employee_state.js";


import {ofDataTable} from "../scripts/misc/_dataTable.js";


import {vw_table_action} from '../scripts/view/vw_pds.js';

import {encoder_logs} from "./misc/encoder_counts.js";



make_public(
    ofArray,
    ofString,
    Validation,
    ofObject,
    ofjQuery
);


(function (w, _) {

    "use_strict";


    const EMPLOYEE_STATUS_APPROVED = 1;



    Page.ready(function () {

        Template.init.then(function () {


            /** @start of include JS **/

            const promise = require_src({
                "/vendor/datatables/datatables/media/js/jquery.dataTables.js": "$.fn.DataTable",
                "/support/js/plugins/sweetalert/sweetalert.min.js": "sweetAlert"
            });


            /** @end of include JS **/


            class table_action extends Event {

                constructor() {
                    super("li", "button", "ul");
                }

                #parent = function (element) {

                    let parent = Element
                        .jQuery(element)
                        .parents(this.name);

                    parent = ofArray.first(parent);

                    if (!parent) throw new Error("Could not find parent of an target element");

                    return Element.jQuery(parent);

                }


                #getId = function (target) {

                    const user_identifier = this
                        .#parent(target)
                        .attr("id") || null;

                    /**
                     * @todo please aware of this,
                     * @deprecated future errors such as the target element
                     * has no identifier
                     * @data could unformatted
                     *
                     * **/

                    if (!user_identifier) throw new Error("Could not find identifier");

                    return user_identifier;

                }

                #getTableData = function (base) {

                    const row_childrens = Element
                        .jQuery(base)
                        .parents("tr")
                        .children('td, th');

                    if (row_childrens.length <= 0)

                        throw new Error("No table data found");

                    return row_childrens;

                }


                #change_button = function (object, trigger_element) {

                    const view = new vw_table_action(object),
                        element = this.#parent(trigger_element);

                    if (element.length <= 0)

                        throw new Error("No element specified");

                    element
                        .parent()
                        .html(view.menu_button);

                    new table_action();

                }


                #confirmation_message = function (message, callback = new Function) {

                    this.mouseover_dropdown_button(this.trigger_element);

                    swal({
                        title: "Are you sure?",
                        className: "swal-custom-style",
                        html: true,
                        text: message,
                        icon: "warning",
                        buttons: ['No, cancel it!', 'Yes, I am sure!'],
                        dangerMode: true,
                    }).then(callback);

                }


                #success_block = function (message, callback = new Function) {

                    swal({
                        title: "Success",
                        text: message,
                        icon: "success",
                        className: "swal-custom-style",
                        confirm: {
                            text: "OK",
                            value: true,
                            visible: true,
                            className: "",
                            closeModal: true
                        }
                    }).then(callback);


                }

                #row_removal = function () {

                    const trigger = this.trigger_element,
                        tableData = this.#getTableData(trigger),
                        element = Element.jQuery(trigger);

                    const removal_row = () => element.closest('tr').remove();

                    tableData.animate({padding: 0})
                        .wrapInner('<div />')
                        .children()
                        .slideUp(removal_row);

                }

                mouseover_list(element) {
                    this.mouseover_dropdown_button(element);
                }

                mouseout_list(element) {
                    this.mouseout_dropdown_button(element);
                }

                mouseover_dropdown_button(element) {

                    this
                        .#getTableData(element)
                        .css("background", "#f9dda96e");

                }

                mouseout_dropdown_button(element) {

                    this
                        .#getTableData(element)
                        .removeAttr("style");

                }

                click_editPDS(trigger) {

                    const id = this.#getId(trigger);
                    window.location.href= "/pds/edit_pds/"+id;

                }

                click_blockPDS(trigger) {

                    const root = this,
                        id = this.#getId(trigger),
                        ofBlock = new block(id);

                    const message = "Cant find in PDS but move to the block list";

                    this.#confirmation_message(message, function (decision) {

                        if (!decision) return;

                        ofBlock.send(function () {

                            root.mouseover_dropdown_button(trigger);
                            const block_message = "Successfully added to the block list";

                            root.#success_block(block_message, function () {
                                root.#row_removal(trigger);
                            })

                        })

                    })

                }

                click_approvePDS(trigger) {

                    const root = this,
                        id = this.#getId(trigger),
                        ofApproved = new approved_pds(id),
                        element = root.#parent(trigger);

                    ofApproved.send(function (data) {

                        root.#change_button({
                            userId: id,
                            Status: EMPLOYEE_STATUS_APPROVED
                        }, trigger)

                    })

                }

                click_removePDS() {

                    const root = this,
                        message = "You are attempting to remove an " +
                            "information of employee, this wont recoverable to the system",
                        id = this.#getId(this.trigger_element),
                        ofRemove = new remove_pds(id)

                    this.#confirmation_message(message, function (decision) {

                        if (!decision) return;

                        ofRemove.send(function () {

                            const block_message = "Successfully remove a information, " +
                                "see your logs for more information";

                            root.mouseover_dropdown_button(root.trigger_element);

                            root.#success_block(block_message, function () {
                                root.#row_removal();
                            })

                        });


                    })

                }

            }


            class rightside_buttons extends Event {

                constructor() {
                    super("button")
                }

                click_btnAdd() {

                    window.location.href = '/pds/newPds'

                }

                click_btnRefresh() {

                    /** initialized after page loaded **/

                    const UTILS = new init();
                    UTILS.start();

                }

                click_btnUsersTotal() {

                    encoder_logs.count.then(function (response) {

                        console.log(response);

                    })
                    
                }

            }


            class formatting_response_from_ajax {

                #requestParams = [
                    "name",
                    "Birthday",
                    "Sex",
                    "CivilStatus",
                    "eligibility",
                    "skills",
                    "Cellphone",
                    "Telephone",
                    "Status"
                ];

                #parseData = null;

                constructor(data) {

                    const root = this;
                    data = this.#filterData(data);

                    const mapFunc = function (perData, index) {

                        const telephone = (perData.Telephone ? ", " + (perData.Telephone) : NOTHING),
                            contact = (perData.Cellphone || NOTHING) + telephone;

                        const view = new vw_table_action(perData);

                        let array = w.array(
                            perData.name,
                            perData.Birthday,
                            perData.Sex,
                            perData.CivilStatus,
                            perData.eligibility,
                            perData.skills,
                            contact,
                            view.menu_button
                        );

                        return array.map(everyData => everyData || "");

                    };

                    this.#parseData = data.map(mapFunc);


                }

                get data() {

                    if (this.#parseData === null) throw new Error("No data available");
                    return this.#parseData;

                }


                #filterData = function (data_array) {

                    const root = this;

                    const _filterFunc = (item_json) => ofJSON.checkAttributes(item_json, root.#requestParams);

                    const array = Array
                        .from(data_array)
                        .filter(_filterFunc);

                    if (data_array.length !== array.length) warning("Some data is not proper format");

                    return array;

                }


            }


            class pds_list {

                #requestURL = "/pds/getEmployees";

                constructor(callback) {


                    const root = this;

                    if (typeof callback !== "function")

                        throw new Error("Parameter 1 not valid function");

                    this.#send(function (parseData) {

                        const format = new formatting_response_from_ajax(parseData);
                        callback(format.data);

                    });

                }

                #parser = function (response) {

                    const isArray = ofArray.isValid(response);

                    if (!isArray) throw new Error("Not valid array response format : " + response);

                    return ofString.parseType(response);

                };

                #send = function (callback = new Function) {

                    const root = this;

                    w.jQuery.post(root.#requestURL, EMPTY_OBJECT, function (respond) {

                        const afterParse = root.#parser(respond);
                        callback(afterParse);

                    });

                }


            }


            class init {

                start() {

                    const pds = new pds_list(data => this.#forTable(data));
                    return pds;

                }


                #forTable = function (formated) {

                    const obj = {"data": formated};

                    const pds_table = new ofDataTable(
                        "pdsTable",
                        obj,
                        this.#whenTableComplete
                    );

                }

                #whenTableComplete = function () {

                    const upper_right_buttons = new rightside_buttons();
                    const right_table_action = new table_action();

                }


            } //end init


            const UTILS = new init();


            promise.then(() => UTILS.start());


        });


    });


})(!this ? window : this,
    window.hasOwnProperty("jQuery") ? window.jQuery : document);

