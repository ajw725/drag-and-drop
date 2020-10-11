"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Department = (function () {
    function Department(id, name) {
        this.id = id;
        this.name = name;
        this.employees = [];
    }
    Department.prototype.hire = function (employee) {
        this.employees.push(employee);
    };
    Department.prototype.printRoster = function () {
        console.log(this.employees.length);
        console.log(this.employees);
    };
    return Department;
}());
var ITDepartment = (function (_super) {
    __extends(ITDepartment, _super);
    function ITDepartment(id, admins) {
        var _this = _super.call(this, id, 'IT') || this;
        _this.admins = admins;
        return _this;
    }
    ITDepartment.prototype.describe = function () {
        console.log('I am an IT department!');
    };
    return ITDepartment;
}(Department));
var AccountingDepartment = (function (_super) {
    __extends(AccountingDepartment, _super);
    function AccountingDepartment(id, reports) {
        var _this = _super.call(this, id, 'Accounting') || this;
        _this.reports = reports;
        _this.lastReport = reports[0];
        return _this;
    }
    Object.defineProperty(AccountingDepartment.prototype, "mostRecentReport", {
        get: function () {
            if (this.lastReport) {
                return this.lastReport;
            }
            throw new Error('No report found.');
        },
        set: function (newVal) {
            this.mostRecentReport = newVal;
        },
        enumerable: false,
        configurable: true
    });
    AccountingDepartment.getInstance = function () {
        if (!this.instance) {
            this.instance = new AccountingDepartment('accounting', ['First Report']);
        }
        return this.instance;
    };
    AccountingDepartment.prototype.describe = function () {
        console.log('Welcome to Accounting!');
    };
    AccountingDepartment.prototype.addReport = function (text) {
        this.reports.push(text);
        this.lastReport = text;
    };
    AccountingDepartment.prototype.printReports = function () {
        console.log(this.reports);
    };
    AccountingDepartment.prototype.hire = function (name) {
        if (name === 'Andrew') {
            console.error('Andrew is not an accountant');
            return;
        }
        this.employees.push(name);
    };
    return AccountingDepartment;
}(Department));
var itDept = new ITDepartment('d2', ['Andrew']);
console.log(itDept);
var accounting = AccountingDepartment.getInstance();
accounting.addReport('Something went wrong');
accounting.hire('Andrew');
accounting.hire('Alli');
console.log(accounting);
console.log("Most recent report: " + accounting.mostRecentReport);
//# sourceMappingURL=classes.js.map