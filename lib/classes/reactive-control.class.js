"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveControl = void 0;
const forms_1 = require("@angular/forms");
const list_class_1 = require("./list.class");
class ReactiveControl extends forms_1.FormControl {
    constructor() {
        super(...arguments);
        this.value = null;
        this._submitted = false;
    }
    get submitted() {
        return this._submitted;
    }
    /**
     * Returns list of errors based on errors property
     */
    get errorsList() {
        return list_class_1.List.fromObject(this.errors);
    }
    submit() {
        this._submitted = true;
        this.markAllAsTouched();
    }
    reset() {
        super.reset();
        this._submitted = false;
    }
}
exports.ReactiveControl = ReactiveControl;
