"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveGroup = void 0;
const forms_1 = require("@angular/forms");
const reactive_control_class_1 = require("./reactive-control.class");
const list_class_1 = require("./list.class");
const reactive_array_class_1 = require("./reactive-array.class");
class ReactiveGroup extends forms_1.FormGroup {
    constructor() {
        super(...arguments);
        this.value = null;
        this.errors = null;
        this._serverError = null;
        this._submitted = false;
    }
    /**
     * returns list of errors based on errors property
     */
    get errorsList() {
        return list_class_1.List.fromObject(this.errors);
    }
    /**
     * Returns true if the formGroup was previously submitted
     */
    get submitted() {
        return this._submitted;
    }
    /**
     * Returs errors from server after submitting formGroup
     */
    get serverError() {
        return this._serverError;
    }
    /**
     * Submits formGroup (validating all the fields and submitting them)
     * @returns promise with resolve(value) or reject(validationErrors)
     */
    submit(onSuccess, onFailure) {
        this._submitted = true;
        for (const key of Object.keys(this.controls)) {
            if (this.controls[key] instanceof reactive_control_class_1.ReactiveControl) {
                this.controls[key].submit();
            }
        }
        this.markAllAsTouched();
        if (this.invalid) {
            onFailure === null || onFailure === void 0 ? void 0 : onFailure(this.errors);
            return Promise.reject(this.errors);
        }
        onSuccess === null || onSuccess === void 0 ? void 0 : onSuccess(this.value);
        return Promise.resolve(this.value);
    }
    setErrors(errors) {
        super.setErrors(errors);
    }
    setServerError(message) {
        const { value } = this;
        this._serverError = {
            value,
            message,
        };
    }
    removeServerError() {
        this._serverError = null;
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
        for (const key of Object.keys(this.controls)) {
            const control = this.controls[key];
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
            if (control instanceof ReactiveGroup) {
                const err = control.getErrorsRecursively();
                if (err)
                    assign(err);
            }
            if (control instanceof reactive_array_class_1.ReactiveArray) {
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
    getErrorsListRecursively() {
        return list_class_1.List.fromObject(this.getErrorsRecursively());
    }
    get(path) {
        return super.get(path);
    }
    reset() {
        super.reset();
        this._submitted = false;
    }
}
exports.ReactiveGroup = ReactiveGroup;
