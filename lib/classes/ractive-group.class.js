import { FormGroup } from '@angular/forms';
import { ReactiveControl } from './reactive-control.class';
import { List } from './list.class';
import { ReactiveArray } from './reactive-array.class';
export class ReactiveGroup extends FormGroup {
    constructor() {
        super(...arguments);
        this._serverError = null;
        this._submitted = false;
    }
    /**
     * returns list of errors based on errors property
     */
    get errorsList() {
        return List.fromObject(this.errors);
    }
    /**
     * Returns true if the formGroup was previously submitted
     */
    get submitted() {
        return this._submitted;
    }
    /**
     * Returns errors from server after submitting formGroup
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
            if (this.controls[key] instanceof ReactiveControl) {
                this.controls[key].submit();
            }
        }
        this.markAllAsTouched();
        if (this.invalid) {
            onFailure?.(this.errors);
            return Promise.reject(this.errors);
        }
        onSuccess?.(this.value);
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
            errors[key] = {
                ...this.errors[key],
                control: this
            };
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
            if (control instanceof ReactiveControl) {
                const err = control.errors;
                if (err) {
                    for (const key of Object.keys(err)) {
                        err[key] = {
                            ...err[key],
                            control
                        };
                    }
                    assign({ ...err });
                }
            }
            if (control instanceof ReactiveGroup) {
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
    getErrorsListRecursively() {
        return List.fromObject(this.getErrorsRecursively());
    }
    get(path) {
        return super.get(path);
    }
    reset() {
        super.reset();
        this._submitted = false;
    }
}
