/**
 * @fileOverview 
 *  Simple class to perform the table sort: was created specifically to compensate for the fact that - sometimes - sorting datatables cannot be applied. 
 *  The other usefulness is that it's a single file. It does not depends on any other file (css, javascript, etc.)
 *  Add the .toSort class to the th to be sorted.
 *  Add the .defaultSort class to the th to be sorted immediately upon loading the table.
 * @author Davide Buccella
 * @version 2.4.2
 * @dependency none
 * @license MIT
 */
 class MySortingTable {
    selector = '';
    selectorForId = '';
    isCaseSensitive = false;

    g = {
        path: {
            d: ''
        }
    }

    defaultSortIcon = {
        size: {
            w: 13,
            h: 13
        },
        svg: {
            viewBox: '0 0 36.678 36.678', 
            style: 'enable-background:new ' + this.viewBox + '; margin-left: 1rem;',
            g: {
                path: {
                    d: `M29.696,20.076c0.088,0.16,0.08,0.354-0.021,0.51L19.395,36.449c-0.091,0.139-0.241,0.224-0.407,0.229 c-0.004,0-0.008,0-0.015,0c-0.157,
                    0-0.31-0.076-0.403-0.205L6.998,20.609c-0.11-0.15-0.127-0.354-0.041-0.521 c0.085-0.168,0.257-0.272,0.444-0.272h21.855C29.443,19.814,29.609,
                    19.914,29.696,20.076z M7.401,16.865h21.855 c0.008,0,0.017,0,0.021,0c0.275,0,0.5-0.225,0.5-0.5c0-0.156-0.07-0.295-0.184-0.388L18.086,
                    0.205 C17.989,0.072,17.821,0.002,17.668,0c-0.165,0.005-0.315,0.09-0.406,0.229L6.982,16.094c-0.101,0.152-0.105,0.35-0.021,0.512 C7.05,16.765,
                    7.218,16.865,7.401,16.865z`
                }
            }
        }
    };
    descSortIcon = {
        size: {
            w: (this.defaultSortIcon.size.w + 3),
            h: 8
        },
        svg: {
            viewBox: '0 0 31.999 32', 
            style: 'enable-background:new ' + this.viewBox + '; margin-left: 0.8rem;',
            g: {
                path: {
                    d: `M31.92,5.021l-14.584,22.5c-0.089,0.138-0.241,0.223-0.406,0.229c-0.004,0-0.009,0-0.014,0 c-0.16,0-0.312-0.076-0.404-0.205L0.096,5.044C-0.015,
                    4.893-0.031,4.69,0.054,4.523C0.139,4.354,0.312,4.25,0.5,4.25h31 c0.183,0,0.352,0.1,0.438,0.261C32.026,4.67,32.019,4.867,31.92,5.021z`
                }
            }
        }
    }

    constructor(selector, isCaseSensitive = false) {
        this.isCaseSensitive = isCaseSensitive;
        document.querySelectorAll(selector).forEach(sel => {
            this.selector = sel;
            this.removeClass(this.selector.querySelectorAll('th'), 'asc desc');
            this.iconInit();
            if (!this.hasClass(this.selector, 'initialized')) {

                var that = this;
                var elems = this.selector.querySelectorAll('th.toSort');
                elems.forEach((elem, index) => {
                    elem.addEventListener('click', function () { that.clickEvent(this, index); });
                });
                this.addClass(this.selector, 'initialized');
            }
            var elemsToClick = this.selector.querySelectorAll('th.toSort.defaultSort');
            elemsToClick.forEach(etc => { etc.click();});
        });
    }
    getRandomId() {
        return Math.floor(Math.random() * 1000);
    }
    clickEvent(thClicked, index) {
        var table = thClicked.closest('table');
        var tbody = table.querySelector('tbody');
        var tdToSort = tbody.querySelectorAll('tr > td:nth-child(' + (index + 1) + ')');

        var values = [];
        tdToSort.forEach(function (elem, index) {
            var dataId = 'trToSort_' + index;
            elem.closest('tr').setAttribute('data-mysortingtable', dataId);
            var value = elem.innerText;
            values.push({
                dataId: dataId,
                value: value
            });
        });
        if (this.hasClass(thClicked, 'desc')) this.sortAsc(values, thClicked);
        else if (this.hasClass(thClicked, 'asc')) this.sortDesc(values, thClicked);
        else this.sortAsc(values, thClicked);

        values.forEach(v => {
            tbody.append(tbody.querySelector('[data-mysortingtable="' + v.dataId + '"]'));
        });
    }
    iconInit() {
        this.removeSortIcons();
        var elems = this.selector.querySelectorAll('th.toSort');
        elems.forEach(elem => { elem.style.cursor = 'pointer'; });
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
        this.changeClass(th, 'desc', 'asc');

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
        this.changeClass(th, 'asc', 'desc');
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
                elem.forEach(e => { e.innerHTML += htmlToAppend; });
            } else {
                if (!!elem) elem.innerHTML += htmlToAppend;
            }
        }
    }
    hasClass(selector, className) {
        return selector.classList.contains(className);
    }
    removeSortIcons() {
        this.removeDomElem(this.selector.querySelectorAll('.fa-sort-desc, .fa-sort-asc, .fa-sort'));
    }
    removeDomElem(elem) {
        if (!!elem) {
            if (elem.length === 1) elem.remove();
            else if (elem.length > 1) elem.forEach(e => { e.remove(); });
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
        th.innerHTML += html;
    }
    getDefaultSortSvg() {
        return this.getSvgTemplate(this.defaultSortIcon.size, this.defaultSortIcon.svg.viewBox, this.defaultSortIcon.svg.style, this.defaultSortIcon.svg.g);
    }
    getDescSortSvg() {
        return this.getSvgTemplate(this.descSortIcon.size, this.descSortIcon.svg.viewBox, this.descSortIcon.svg.style, this.descSortIcon.svg.g);
    }
    getAscSortSvg() {
        return this.getSvgTemplate(this.descSortIcon.size, this.descSortIcon.svg.viewBox, this.descSortIcon.svg.style + ' margin-bottom: 5px; transform: rotate(180deg); ', this.descSortIcon.svg.g);
    }
    getSvgTemplate(size, viewBox, style, g) {
        return '<svg version="1.1" class="sortIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + size.w + 'px" height="' + size.h + 'px" viewBox="' + viewBox + '" style="' + style + '"> <g> <path d="'+g.path.d+'"/> </g></svg>';
    }
}