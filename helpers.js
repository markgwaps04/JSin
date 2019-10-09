/**
 * @author Mark Anthony Libres
 * @type {{updateKeys: (function(*=, *=): *), localStorage: *, json_removeEmptyValues: (function(*=): *), promise: (function(*=): Promise<any>), main: _helpers.main, showHiddens: _helpers.showHiddens, documentReady: _helpers.documentReady, queryUsers: _helpers.queryUsers, isNodeType: (function(*): boolean), dataAttributes: (function(*=)), hasOwnProperty: (function(*, ...[*]): boolean), isJquery: (function(*=): (*|boolean|string)), toBlob: (function(*): Blob), loop: _helpers.loop, define: _helpers.define, removeLoadings: _helpers.removeLoadings, checkObject: (function(*=)), Querfy: (function(*=, *=)), getJSONAttributesOnly: (function(*=, *=)), addClass: (function(*, ...[*]): _helpers), checkType: _helpers.checkType, TryCatch: _helpers.TryCatch, getContainer: (function(*=): *), removeClass: (function(*, ...[*]): _helpers), removeAttr: (function(*, ...[*]): *), isEmpty: _helpers.isEmpty, hasClass: (function(*, *=): boolean), toJquery: _helpers.toJquery, defaultAttributes: (function(*=, *=): *), getServerTemplate: (function(*=): Promise<any>), concat: (function(...[*]): (*|string[]|string|T[]|*[])), loading: _helpers.loading, defaultValPropertyOfNull: (function(*=, *, *): (*|undefined)), replaceBy: (function(*, *): string), caller: (function(*, ...[*]): _helpers), jQuery: (function(...[*]): (p.fn.init|jQuery|HTMLElement)[]), fromJquery: _helpers.fromJquery, ifThenDefault: (function(*=, *): (*|undefined)), importScripts: (function(...[*]): Promise<any>), hideBody: (function(): _helpers), endsWith: _helpers.endsWith, showBody: (function(): _helpers), page: *, serializeArray: _helpers.serializeArray}}
 * @private
 */


export const _helpers = {

    removeAttr: function (element, ...args) {

        const remove = function (item) {
            element.removeAttribute(item);
        };

        args.forEach(remove);

        return element;

    },

    get page() {

        const root = this;

        const pathname = window.location.pathname,
            byGroup = pathname
                .split("/")
                .filter(Boolean);


        const get = {

            get parent() {

                return root.TryCatch(() => byGroup[2] || "", () => "");

            },

            get methodOf() {

                return root.TryCatch(() => byGroup[3] || "", () => "");

            },


            get parameterOf() {

                return root.TryCatch(() => byGroup[4] || "", () => "");

            },

            get parent_url() {

                return "/SCOA/public/" + this.parent + "/";

            },

        };


        return get;

    },

    addClass: function (element, ...classes) {

        if (!(element instanceof Array))

            element = [element];

        const add = function (targetEle) {

            classes.forEach(function (item) {

                if (!targetEle.nodeType) return;
                const alreadyAddedClass = targetEle.className || "";
                targetEle.className = alreadyAddedClass + " " + String(item);

            });

        };

        element.forEach(add);

        return this;

    },

    removeClass: function (element, ...classes) {


        if (!(element instanceof Array))

            element = [element];

        const add = function (targetEle) {

            classes.forEach(function (item) {

                if (!targetEle.nodeType) return;

                targetEle.classList.remove(item);

            });


        };

        element.forEach(add);

        return this;

    },

    replaceBy: function (template, replacePairs) {

        let str = template.toString(), key, re;

        for (key in replacePairs) {

            if (!isNaN(key)) key = "\\" + key;

            re = new RegExp("\{" + key + "\}", "gm");
            str = str.replace(re, replacePairs[key]);

        }
        return str;

    },

    showHiddens: function (hiddenClass = "hiddenBy") {

        const hiddens = document.querySelectorAll("." + hiddenClass);

        hiddens.forEach(function (element) {
            const classList = element.classList;
            classList.remove(hiddenClass);
        });

    },

    removeLoadings: function (loadingClass = "loadingBy") {

        const hiddens = document.querySelectorAll("." + loadingClass);

        hiddens.forEach(function (element) {
            element.remove();
        });

    },

    loading: function (loadingClass = "load") {

        const hiddens = document.querySelectorAll("." + loadingClass);

        console.log(hiddens);


    },

    caller: function (object, ...propertys) {

        const call = function (item) {

            if (!object.hasOwnProperty(item) || !item)

                throw new Error("Not found property of " + item);

            const returne = object[item]();
            object = returne;
        }

        propertys.forEach(call);
        return this;

    },

    jQuery: function (...attr) {

        if (!window.hasOwnProperty("jQuery"))

            throw new Error("jQuery plugin not found");

        return attr.map(function (ele) {
            const element = jQuery(ele);
            const nonChar = String(ele).replace(/\W/gm, "");
            window[nonChar] = element;
            return element;

        });

    },

    TryCatch: function (resolve, reject) {

        try {
            return resolve();
        } catch (err) {
            return reject(err);
        }

    },

    isEmpty: function (data) {

        const typeOfData = typeof data;
        const NOTHING = null;

        switch (true) {

            case typeOfData === "string" :

                return String(data).replace(/\s/gm, "") ? false : true;

                break;

            case typeOfData === "object" :

                if (data instanceof Array)

                    return data.length ? false : true;

                return Object.keys(data).length ? false : true;

                break;

            case typeOfData === "number" :

                return true;

                break;


            default :

                return true;

                break;


        }


    },

    documentReady: function (callBack) {


        try {

            window.onload = callBack;

        } catch (e) {

            throw new Error(e);

        }

    },

    define: function (protoType, name, callBack) {

        Object.defineProperty(protoType, name, {

            enumerable: false,
            value: callBack

        });


    },

    hasClass: function (element, _class) {

        return element.classList.contains(_class);

    },

    hasOwnProperty: function (object, ...propertys) {

        const call = function (item) {

            if (!object.hasOwnProperty(item) || !item) {

                console.warn("Not found property of " + item);

                return false;

            }

            if (typeof object[item] === "function")

                object = object[item]();

            else if (typeof object[item] === "object" && !typeof object[item] instanceof Array)

                object = object[item];

            return true;

        }

        return propertys.every(call);

    },

    defaultAttributes: function (object, _defaults) {

        if (this.checkType(object) !== "object")

            throw new Error("target value to be assigned as default is not valid Object");

        return Object.assign(object, _defaults);

    },

    hideBody: function () {

        scoa.addClass("body"._getTag(), "display-none");

        return this;

    },

    showBody: function () {
        scoa.removeClass("body"._getTag(), "display-none");

        return this;

    },

    concat: function (...args) {

        args = this.first_array(args);

        return args.reduce((on, item) => {

            return on.concat(String(item));

        }, "");

    },

    endsWith: function (target, ends) {

        if (target) return String(target).concat(ends);

        return "";

    },

    promise: function (callBack) {

        return new Promise(callBack);

    },

    checkType: function (value) {

        const typeOfData = typeof value;

        if (typeOfData === "object") {

            if (value === null) return "null";

            if (value instanceof Array) return "array";

            const nodeType = this.defaultValPropertyOfNull(value, "nodeType", false);

            if (nodeType === Node.ELEMENT_NODE) return value.nodeName;

            return "object";

        }


        return this.TryCatch(function () {

            return typeof JSON.parse(value);

        }, function () {

            return typeOfData;

        })

    },

    checkObject: function (obj) {

        const root = this;
        const newObj = {};

        if (this.checkType(obj) !== "object")

            throw new Error("Parameter 1 not valid as object type");

        Object.keys(obj).forEach(function (e) {

            newObj[e] = root.checkType(obj[e]);

        });

        return newObj;

    },

    isJquery: function (element) {

        return element && (element instanceof jQuery || element.constructor.prototype.jquery);
    },

    isNodeType: function (element) {

        return this.ifThenDefault(element.nodeType, false) === Node.ELEMENT_NODE;
    },

    toJquery: function (queryElement) {

        const type = this.checkType(queryElement);

        if (!this.isJquery(queryElement)) {

            switch (true) {

                case type === "string" :
                    return jQuery(queryElement);
                    break;

                case this.isNodeType(queryElement) :
                    return jQuery(queryElement);
                    break;

                default :

                    throw new Error('Your target element is not valid syntax');
                    break;
            }

        }

        return queryElement;

    },

    loop: function (array, callBack) {

        if (typeof callBack !== "function") return;

        for (let index = 0; index < array.length; index++) {

            const value = array[index];
            const response = callBack(value, index);

            if (response) return response;

        }

        return false;

    },

    queryUsers: function (element, config) {

        const root = this;
        const init = {

            get usersHintParentCard() {

                return [
                    '<div class="ProfileCard def u-cf border-bottom">',
                    '<img ' +
                    'class="ProfileCard-avatar profile" ' +
                    'letters="{Firstname}" ',
                    'identifier="profile_user{user_url}" ',
                    '_src="/SCOA/public/files/profile/{profile}">',
                    '{card_details}',
                    '</div>',
                ].join("\n");

            },

            get usersHintCardDetails() {

                return [
                    '<div class="ProfileCard-details">',
                    '<div class="ProfileCard-realName">' +
                    '{Firstname} ' +
                    '{Middlename} ' +
                    '{Lastname}' +
                    '</div>',
                    '<div class="ProfileCard-screenName">@{user_url}</div>',
                    '<div class="ProfileCard-description">{description}</div>',
                    '</div>'
                ].join("\n");


            },

            get usersMainHint() {

                const partial = this
                    .usersHintParentCard
                    .setTokens({
                        card_details: this.usersHintCardDetails
                    });


                return partial.setTokens({
                    description: [
                        "<small>",
                        "{CP}",
                        "</small>",
                        "<p>",
                        "<small>",
                        "last active : {last_active}",
                        "</small>",
                        "</p>"
                    ].join("\n")
                });

            },

            get request() {

                const users = new Bloodhound({
                    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('user_url'),
                    queryTokenizer: Bloodhound.tokenizers.whitespace,
                    remote: {
                        url: config.url.concat("/%QUERY"),
                        wildcard: '%QUERY',
                    }

                });

                users.initialize();

                return users;

            }

        };

        config = Object.assign({
            source: init.request,
            templates: {
                suggestion: function (item) {

                    return init.usersMainHint.setTokens({
                        Firstname: item.Firstname,
                        Middlename: item.Middlename,
                        Lastname: item.Lastname,
                        user_url: item.user_url,
                        description: item.about || "",
                        profile: item.profile,
                        CP: item.CP,
                        last_active: item.last_active || "<strong class='text-navy'>online</strong>"
                    });

                }
            }

        }, config);


        return this
            .toJquery(element)
            .typeahead(null, config);

    },

    Querfy: function (objTo, arrayToGetOnly) {

        const __obj = {};

        if (this.checkType(arrayToGetOnly) !== "array")

            throw new Error("Parameters 2 not valid array");


        if (this.checkType(objTo) !== "object")

            throw new Error("Parameters 1 not valid object");

        arrayToGetOnly.forEach(function (e) {

            if (!objTo.hasOwnProperty(e)) return;

            __obj[e] = objTo[e];

        });


        return __obj;

    },

    updateKeys: function (objTo, objBase) {

        const root = this;

        if (this.checkType(objBase) !== "object")

            throw new Error("Parameters 1 not valid object");


        if (this.checkType(objTo) !== "object")

            throw new Error("Parameters 1 not valid object");


        Object.keys(objBase).forEach(function (value) {

            const isSpecified = objTo.hasOwnProperty(value);

            if (!isSpecified) return;

            const currItem = objBase[value];

            if (root.checkType(currItem) !== "string")

                throw new Error("Not valid string type");

            objTo[currItem] = objTo[value];

            delete objTo[value];

        });

        return objTo;

    },

    dataAttributes: function (element) {

        const root = this;

        const target = this.toJquery(element);
        const attributes = target
            .find("scoa_attr[type]")
            .get();

        const obj = {};

        attributes.forEach(function (e) {

            const attr = jQuery(e).attr("type");
            const value = jQuery(e).text();

            if (root.isEmpty(attr)) return;
            if (root.isEmpty(value)) return;

            obj[attr] = value;

        });

        return obj;

    },

    getServerTemplate: function (Obj) {

        if (this.checkType(Obj) !== "object")

            throw new Error("Invalid type parameter 1 Object required");

        const newObj = Object.assign(new Object(), Obj);

        if (!this.hasOwnProperty(newObj, "template_url", "data", "template_variable"))

            throw new Error("Invalid attributes at Object");


        if (this.checkType(newObj['data']) !== "object")

            throw new Error("Invalid type of Object attrbute 'data' should be Object");


        newObj['data'] = JSON.stringify(newObj['data']);
        newObj['template_url'] = this.concat(
            "../../SCOA/public/included_template/",
            newObj["template_url"]
        );


        const request_path = this.page.parent_url + "getTemplate";

        return new Promise(function (resolve) {

            jQuery.post(request_path, newObj, function (res) {
                resolve(res);
            });

        });

    },

    getContainer: function (isJquery = false) {

        return "content"._getClass(isJquery);

    },

    toBlob: function (dataURI) {

        const byteString = atob(dataURI.split(",")[1]);

        /** represents as array of bytes **/

        const arrayBuff = new ArrayBuffer(byteString.length) //es5

        /** Uint8Array(param) where param is referring to arrayBuff **/

        const arrayUInt = new Uint8Array(arrayBuff) //es5

        for (let i = 0; i < byteString.length; i++) arrayUInt[i] = byteString.charCodeAt(i);

        return new Blob([arrayBuff], {type: 'image/png'})


    },

    fromJquery: function (element) {

        const isValidJQuery = this.isJquery(element)
            ? element.length == 1
            : false;

        if (isValidJQuery) return element[0];

        if (this.isNodeType(element)) return element;

        throw new Error("Parameter 1 is not valid type as node or prototype of jQuery");

    },

    /**
     * Work only on IE10 above
     * @param {node}
     */

    serializeArray: function (element, format = false) {

        if (this.checkType(element) !== "FORM")

            throw new Error("Paramter 1 is not valid form element");

        const map = function (value) {

            return {name: value[0], value: value[1]};

        };

        const tempResult = Array.from(new FormData(element), map)

        if (!format) return tempResult;

        const obj = {};


        tempResult.forEach(function (curr) {
            const name = curr.name;
            const value = curr.value;
            obj[name] = value;
        });


        return obj;


    },

    get localStorage () {

        const root = this;

        function encodedByType(value) {

            const type = root.checkType(value);

            if(type === "array" || type === "object")

                return btoa(JSON.stringify(value));

            return btoa(value);

        }

        const init = {

            get of() {

                return localStorage;

            }

        };

        return init;

    },

    importScripts: function (...args) {

        const root = this;

        let count = -1;
        const length = args.length - 1;
        const next = function () {

            const tempLength = length + 1;
            const tempCount = count + 1;

            if (tempLength <= tempCount) return;

            count += 1;

            return args[tempCount];
        };


        return new Promise(function (resolve, reject) {

            const current = function () {

                const curr = next()

                if (root.isEmpty(curr)) return resolve();

                import(curr)
                    .then(current)
                    .catch(e => reject(e, curr));

            };

            current();

        });

    },

    ifThenDefault: function (obj, def) {

        return this.TryCatch(function () {

            return obj === undefined ? def : obj;

        }, () => def)

    },

    defaultValPropertyOfNull: function ($obj, $property, _default) {

        if (typeof $obj !== "object" && $obj === null)

            throw new Error("Parameter 1 not valid as object type");

        return this.TryCatch(function () {

            const $out = $obj[$property];

            if ($out === undefined) return _default;

            return $out;

        }, () => _default);


    },

    getJSONAttributesOnly : function(json,array) {


        if(this.checkType(json) !== "object")

            throw new Error("Parameter 1 is not valid JSON type");

        if(this.checkType(array) !== "array")

            throw new Error("Parameter 2 is not valid array type");

        const obj = {};

        array.forEach( function (item) {

            if( !json.hasOwnProperty(item) )

                throw new Error(item + " is not property of json");

            obj[item] = json[item];

        });

        return obj;

    },

    json_removeEmptyValues : function(obj) {

        const root = this;

        if(this.checkType(obj) !== "object") throw new Error("paramater 1 is not valid object type");

        Object.keys(obj).forEach(function (key) {

            if(!root.isEmpty(obj[key])) return;

            delete obj[key];

        });

        return obj;

    },

    isValidJSON_string : function(testValue)
    {

        if(typeof testValue !== "string") throw new Error("Invalid string type value");

        const parser = String(testValue)._parseType();

        return (this.checkType(parser) === "object");

    },


    isValidArray_string : function(testValue)
    {

        if(typeof testValue !== "string") throw new Error("Invalid string type value");

        const parser = String(testValue)._parseType();

        return (this.checkType(parser) === "array");

    },


    isValidObject_string : function(testValue)
    {

        if(typeof testValue !== "string") throw new Error("Invalid string type value");

        const parser = String(testValue)._parseType();

        return (this.checkType(parser) === "object");

    },


    checkAttributes_json : function(json,array)
    {

        if(this.checkType(json) !== "object")

            throw new Error("Parameter 1 not valid object type");

        if(this.checkType(array) !== "array")

            throw new Error("Parameter 2 not valid array type");

        return Array
            .from(array)
            .every(item => json.hasOwnProperty(item));


    },


    toAttributes_string : function(json)
    {

        const root = this;

        if(this.checkType(json) !== "object")

            throw new Error("Parameter 1 is not valid object");

        const keys = Object.keys(json);
        let ofString = "";

        keys.forEach(function (ofKey) {

            const type = root.checkType(json[ofKey]);

            const hasAssign = type === "string"
            ? String(json[ofKey]).length > 0
            : true


            if(!hasAssign)
            {
                ofString =  ofString.concat(" "+ofKey);
                return;
            }


            switch (hasAssign)
            {

                case type === "string":

                    ofString =  ofString.concat(" '"+ofKey + "'='" + json[ofKey] + "'")
                    return;

                    break;
                case type === "boolean" || type === "number":

                    ofString =  ofString.concat(" '"+ofKey + "'=" + String(json[ofKey]) + "");
                    return;

                    break;
                default :

                    ofString =  ofString.concat(" '"+ofKey + "'=" + JSON.stringify(json[ofKey]) + "");
                    return;

                    break;

            }


        });


        return ofString.trim();

    },

    first_array : function(array)
    {

        const FIRST_ROW = 0;

        array = Array.from(array);

        return array[FIRST_ROW] || null;

    },

    page_ready : function (callback)
    {

        if(_helpers.checkType(callback) !== "function")

            throw new Error("Invalid parameter 1 is not valid callback function");

        document.addEventListener("DOMContentLoaded",callback);

    },

    serialize: function(object) {

        if (this.checkType(object) !== "object")

            throw new Error("Parameter 1 not valid object type");

        const keys = Object.keys(object);

        return keys
            .map(item => item + "=" + object[item])
            .join("&");

    },


    main: function () {

        const root = this;

        const types = {

            String: function () {

                const protoType = String.prototype;
                const nodeQuery = {

                    node: document,
                    query: "#",
                    value: null,
                    isJquery: false,

                    get get() {

                        const query = String(this.query).concat(this.value);
                        const returne = this.isJquery
                            ? root.jQuery(query)
                            : (this.node || document).querySelectorAll(query);

                        if (returne.length === 1) return returne[0];
                        return returne;

                    }

                };


                root.define(protoType, "_getId", function (IsJquery = false, val) {

                    nodeQuery.node = val;
                    nodeQuery.value = this;
                    nodeQuery.query = "#";
                    nodeQuery.isJquery = IsJquery;
                    return nodeQuery.get;

                });

                root.define(protoType, "_getClass", function (IsJquery = false, val) {

                    nodeQuery.node = val;
                    nodeQuery.query = ".";
                    nodeQuery.value = this;
                    nodeQuery.isJquery = IsJquery;
                    return nodeQuery.get;

                });

                root.define(protoType, "_getTag", function (IsJquery = false, val) {

                    nodeQuery.node = val;
                    nodeQuery.query = "";
                    nodeQuery.value = this;
                    nodeQuery.isJquery = IsJquery;
                    return nodeQuery.get;

                });

                root.define(protoType, "_getElement", function (IsJquery = false, val) {

                    nodeQuery.node = val;
                    nodeQuery.query = "";
                    nodeQuery.value = "["+this+"]";
                    nodeQuery.isJquery = IsJquery;
                    return nodeQuery.get;

                });

                root.define(protoType, "_getDataAnchor", function (IsJquery = false, val) {

                   const string = "data-anchor='"+String(this)+"'";

                   return string._getElement(IsJquery,val);

                });

                root.define(protoType, "_noDoubleSpace", function () {
                    return String(this).replace(/^\s+|\s+$|\s+(?=\s)/g, "");
                })

                root.define(protoType, "_toggleClass", function (...elements) {

                    const _class = "display-none";

                    elements.forEach(function (value) {

                        const EveryEle = document.querySelectorAll(value);

                        EveryEle.forEach(ele => {

                            if (root.hasClass(ele, _class)) {

                                root.removeClass(ele, _class);
                                return;

                            }

                            root.addClass(ele, _class);
                        })

                    });

                    return this;

                });

                root.define(protoType, "_strCut", function (length = 3, replacement = "...") {

                    let str = this.slice(0, length);

                    if (this.length >= length) str += String(replacement);

                    return str;

                });

                root.define(protoType, "_base64decoded", function () {

                    try {

                        return atob(this);

                    } catch (e) {

                        console.log(String(this));

                    }


                });

                root.define(protoType, "_getContent", function () {

                    return this._getId().innerText;

                });

                root.define(protoType, "_getItemFromLocal", function () {

                    return root.localStorage.getOf(this);

                });

                root.define(protoType, "_IsPathExist", function () {

                    const http = new XMLHttpRequest();
                    http.open('HEAD', this, false);
                    http.send();

                    console.log(http.status);

                    return http.status != 404;

                });

                root.define(protoType, "_parseType", function () {

                    return _helpers.TryCatch(() => JSON.parse(this), () => this);

                });

                root.define(protoType, "setTokens", function (replacePairs,callBack) {


                    let str = this.toString(), key, re;

                    for (key in replacePairs) {

                        if(!isNaN(key)) key = "\\"+key;

                        re = new RegExp("\{" + key + "\}", "gm");
                        str = str.replace(re, replacePairs[key]);

                        if(typeof callBack !== "function") continue;

                        callBack.prototype.constructor({
                            current : key,
                            isEqual : re,
                            value : str
                        });


                    }
                    return str;

                });


            },

            Array: function () {

                const prototype = Array.prototype;

                root.define(prototype, "searchObject", function (ObjectSearch) {

                    if (root.checkType(ObjectSearch) !== "object")

                        throw new Error("Not valid Object");

                    const keys = Object.keys(ObjectSearch);

                    return this.findIndex(function (e) {

                        if (root.checkType(e) !== "object") return;

                        return keys.every(function (search) {

                            if (!e.hasOwnProperty(search)) return;

                            const itemValue = String(e[search]).toLowerCase();
                            const searchValue = String(ObjectSearch[search]).toLowerCase();

                            return itemValue === searchValue;

                        })

                    })

                });


            }

        };

        types.String();
        types.Array();

    },


};

window.warning = message => console.warn(message);


_helpers.main();