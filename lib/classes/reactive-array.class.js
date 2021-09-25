"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveArray = void 0;
const forms_1 = require("@angular/forms");
const reactive_control_class_1 = require("./reactive-control.class");
const ractive_group_class_1 = require("./ractive-group.class");
const list_class_1 = require("./list.class");
class ReactiveArray extends forms_1.FormArray {
    constructor() {
        super(...arguments);
        this.value = [];
        this.controls = [];
        this._submitted = false;
    }
    get submitted() {
        return this._submitted;
    }
    /**
     * returns list of errors based on errors property
     */
    get errorsList() {
        return list_class_1.List.fromObject(this.errors);
    }
    submit(onSuccess, onFailure) {
        this._submitted = true;
        this.markAllAsTouched();
        for (const control of this.controls) {
            control.submit();
        }
        if (this.invalid) {
            onFailure === null || onFailure === void 0 ? void 0 : onFailure(this.errors);
            return Promise.reject(this.errors);
        }
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(this.value);
        return Promise.resolve(this.value);
    }
    /**
   * Returns full list of errors in form
   */
    getErrorsRecursively() {
        const errors = {};
        if (!this.errors)
            return null;
        for (const key of Object.keys(this.errors)) {
            errors[key] = Object.assign(Object.assign({}, this.errors[key]), { control: this });
        }
        const assign = (errorsToAssign) => {
            for (let key of Object.keys(errorsToAssign)) {
                const value = errorsToAssign[key];
                while (Object.keys(errors).includes(key)) {
                    key = `_${key}`;
                }
                Object.assign(errors, { [key]: value });
            }
        };
        for (const control of this.controls) {
            if (control.valid) {
                continue;
            }
            if (control instanceof reactive_control_class_1.ReactiveControl) {
                const err = control.errors;
                if (err) {
                    for (const key of Object.keys(err)) {
                        err[key] = Object.assign(Object.assign({}, err[key]), { control });
                    }
                    assign(Object.assign({}, err));
                }
            }
            if (control instanceof ractive_group_class_1.ReactiveGroup) {
                const err = control.getErrorsRecursively();
                if (err)
                    assign(err);
            }
            if (control instanceof ReactiveArray) {
                const err = control.getErrorsRecursively();
                if (err)
                    assign(err);
            }
        }
        if (!Object.keys(errors).length) {
            return null;
        }
        return errors;
    }
    removeDuplicates(keyFn) {
        const keys = this.value.map(keyFn);
        for (let i = this.controls.length - 1; i >= 0; i--) {
            const val = this.controls[i].value;
            if (i !== keys.indexOf(keyFn(val))) {
                this.removeAt(i);
            }
        }
    }
    reset() {
        super.reset();
        this._submitted = false;
    }
}
exports.ReactiveArray = ReactiveArray;
