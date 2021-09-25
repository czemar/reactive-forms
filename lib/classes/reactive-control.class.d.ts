import { FormControl } from '@angular/forms';
import { List } from './list.class';
import { ValidationErrors } from '../inerfaces/validation-error.interface';
export declare class ReactiveControl<T = any> extends FormControl {
    value: T | null;
    private _submitted;
    get submitted(): boolean;
    /**
     * Returns list of errors based on errors property
     */
    get errorsList(): List<ValidationErrors>;
    submit(): void;
    reset(): void;
}
