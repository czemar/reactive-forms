import { FormControl } from '@angular/forms';
import { List } from './list.class';
export class ReactiveControl extends FormControl {
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
        return List.fromObject(this.errors);
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
