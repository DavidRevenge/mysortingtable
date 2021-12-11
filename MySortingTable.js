/**
 * @fileOverview 
 *  Simple class to perform the table sort: was created specifically to compensate for the fact that - sometimes - sorting datatables cannot be applied. 
 *  The other usefulness is that it's a single file. It does not depend on any other file (css, javascript, etc.)
 *  Add the .toSort class to the th to be sorted.
 *  Add the .defaultSort class to the th to be sorted immediately upon loading the table.
 * @author Davide Buccella
 * @version 2.0.0
 * @dependency none
 * @license MIT
 */
class MySortingTable {
    selector = '';
    selectorForId = '';
    isCaseSensitive = false;

    defaultSortIconSize = {
        w: 13,
        h: 8
    };
    descSortIconSize = {
        w: 12.2,
        h: 8
    };

    constructor(selector) {
        this.selector = selector;
        this.removeClass(this.selector, 'asc desc');
        this.iconInit();
        if (!this.hasClass(this.selector, 'initialized')) {

            this.selectorForId = this.selector.replace(' ', '');
            this.selectorForId = this.selectorForId.replace('.', '_');
            this.selectorForId = this.selectorForId.replace('#', '_');

            var that = this;

            var elems = document.querySelectorAll(this.selector + ' th.toSort');
            elems.forEach((elem, index) => {
                elem.addEventListener('click', function () {
                    that.clickEvent(this, index);
                });
            });
            this.addClass(this.selector, 'initialized');
        }
        var elemsToClick = document.querySelectorAll(this.selector + ' th.toSort.defaultSort');
        elemsToClick.forEach(etc => {
            etc.click();
        });
    }
    clickEvent(thClicked, index) {
        var tbody = document.querySelector(this.selector + ' tbody');
        var tdToSort = document.querySelectorAll(this.selector + ' tbody > tr > td:nth-child(' + (index + 1) + ')');
        var values = [];
        var that = this;
        tdToSort.forEach(function (elem, index) {
            var dataId = that.selectorForId + '_' + 'trToSort_' + index;
            elem.closest('tr').setAttribute('data-mysortingtable', dataId);
            var value = elem.innerText;
            values.push({
                dataId: dataId,
                value: value
            });
        });
        if (this.hasClass(this.selector, 'desc')) this.sortAsc(values, thClicked);
        else if (this.hasClass(this.selector, 'asc')) this.sortDesc(values, thClicked);
        else this.sortAsc(values, thClicked);

        values.forEach(v => {
            tbody.append(document.querySelector('[data-mysortingtable="' + v.dataId + '"]'));
        });
    }
    iconInit() {
        this.removeDomElem(this.find(this.selector, '.fa-sort-desc, .fa-sort-asc, .fa-sort'));
        var elems = document.querySelectorAll(this.selector + ' th.toSort');
        elems.forEach(elem => {
            elem.style.cursor = 'pointer';
        });
        this.appendDefaultSortIcon(elems);
    }
    appendDefaultSortIcon(elems) {
        this.appendHtml(elems, this.getDefaultSortSvg());
    }
    sortAsc(values, th) {
        var that = this;
        values.sort(function (a, b) {
            var sortValues = that.getSortValues(a, b);
            if (sortValues.a < sortValues.b) return -1;
            if (sortValues.a > sortValues.b) return 1;
            return 0;
        });
        this.replaceSortIcon(th, this.getAscSortSvg());
        this.changeClass(this.selector, 'desc', 'asc');

    }
    changeClass(selector, fromClass, toClass) {
        this.removeClass(selector, fromClass);
        this.addClass(selector, toClass);
    }
    sortDesc(values, th) {
        var that = this;
        values.sort(function (a, b) {
            var sortValues = that.getSortValues(a, b);
            if (sortValues.a > sortValues.b) return -1;
            if (sortValues.a < sortValues.b) return 1;
            return 0;
        });
        this.replaceSortIcon(th, this.getDescSortSvg());
        this.changeClass(this.selector, 'asc', 'desc');
    }
    getSortValues(a, b) {
        return {
            a: this.getSortValue(a),
            b: this.getSortValue(b)
        }
    }
    getSortValue(elem) {
        return (this.isCaseSensitive) ? elem.value : elem.value.toLowerCase();
    }
    appendHtml(elem, htmlToAppend) {
        if (!!elem) {
            elem = Array.from(elem);
            if (Array.isArray(elem)) {
                elem.forEach(e => {
                    e.innerHTML += htmlToAppend;
                });
            } else {
                if (!!elem) elem.innerHTML += htmlToAppend;
            }
        }
    }
    find(selector, findClass) {
        var totalSelector = '';
        findClass = findClass.split(', ');
        findClass.forEach((className, index) => {
            var comma = (findClass.length === (index + 1)) ? '' : ', ';
            if (typeof selector === 'string') totalSelector += selector + ' ' + className + comma;
            else totalSelector += className + comma;
        });
        var result = (typeof selector === 'string') ? document.querySelectorAll(totalSelector) : selector.querySelectorAll(totalSelector);
        if (result.length > 1) return result;
        else if (result.length === 1) return result[0];
        else return result;
    }
    hasClass(selector, className) {
        return document.querySelector(selector).classList.contains(className);
    }
    removeDomElem(elem) {
        if (!!elem) {
            if (elem.length === 1) elem.remove();
            else if (elem.length > 1) {
                elem.forEach(e => {
                    e.remove();
                });
            }
        }
    }
    removeClass(selector, className) {
        var elem = (typeof selector === 'string') ? document.querySelector(selector) : selector;
        className = className.split(' ');

        if (!!elem && !!elem.classList) elem.classList.remove(...className);
    }
    addClass(selector, className) {
        var elem = (typeof selector === 'string') ? document.querySelector(selector) : selector;
        className = className.split(' ');
        if (!!elem && !!elem.classList) elem.classList.add(...className);
    }
    replaceSortIcon(th, html) {
        th.querySelector('.sortIcon').remove();
        th.innerHTML += html; //this.getDescSortSvg();
    }
    getDefaultSortSvg() {
        return '<svg version="1.1" class="sortIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="'+this.defaultSortIconSize.w+'px" height="'+this.defaultSortIconSize.h+'px" viewBox="0 0 36.678 36.678" style="enable-background:new 0 0 36.678 36.678; margin-left: 1rem;" xml:space="preserve"> <g> <path d="M29.696,20.076c0.088,0.16,0.08,0.354-0.021,0.51L19.395,36.449c-0.091,0.139-0.241,0.224-0.407,0.229 c-0.004,0-0.008,0-0.015,0c-0.157,0-0.31-0.076-0.403-0.205L6.998,20.609c-0.11-0.15-0.127-0.354-0.041-0.521 c0.085-0.168,0.257-0.272,0.444-0.272h21.855C29.443,19.814,29.609,19.914,29.696,20.076z M7.401,16.865h21.855 c0.008,0,0.017,0,0.021,0c0.275,0,0.5-0.225,0.5-0.5c0-0.156-0.07-0.295-0.184-0.388L18.086,0.205 C17.989,0.072,17.821,0.002,17.668,0c-0.165,0.005-0.315,0.09-0.406,0.229L6.982,16.094c-0.101,0.152-0.105,0.35-0.021,0.512 C7.05,16.765,7.218,16.865,7.401,16.865z"/> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg> ';
    }
    getDescSortSvg() {
        return '<svg version="1.1" class="sortIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="'+this.descSortIconSize.w+'px" height="'+this.descSortIconSize.h+'px" viewBox="0 0 31.999 32" style="enable-background:new 0 0 31.999 32; margin-left: 0.8rem;" xml:space="preserve"> <g> <path d="M31.92,5.021l-14.584,22.5c-0.089,0.138-0.241,0.223-0.406,0.229c-0.004,0-0.009,0-0.014,0 c-0.16,0-0.312-0.076-0.404-0.205L0.096,5.044C-0.015,4.893-0.031,4.69,0.054,4.523C0.139,4.354,0.312,4.25,0.5,4.25h31 c0.183,0,0.352,0.1,0.438,0.261C32.026,4.67,32.019,4.867,31.92,5.021z"/> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg> ';
    }
    getAscSortSvg() {
        return '<svg version="1.1" class="sortIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="'+this.descSortIconSize.w+'px" height="'+this.descSortIconSize.h+'px" viewBox="0 0 31.999 32" style="enable-background:new 0 0 31.999 32; margin-left: 0.8rem; margin-bottom: 5px; transform: rotate(180deg); " xml:space="preserve"> <g> <path d="M31.92,5.021l-14.584,22.5c-0.089,0.138-0.241,0.223-0.406,0.229c-0.004,0-0.009,0-0.014,0 c-0.16,0-0.312-0.076-0.404-0.205L0.096,5.044C-0.015,4.893-0.031,4.69,0.054,4.523C0.139,4.354,0.312,4.25,0.5,4.25h31 c0.183,0,0.352,0.1,0.438,0.261C32.026,4.67,32.019,4.867,31.92,5.021z"/> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> <g> </g> </svg> ';
    }
}