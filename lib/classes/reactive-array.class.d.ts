import { FormArray } from '@angular/forms';
import { ReactiveAbstract } from '../types/reactive-abstract.type';
import { ValidationErrors } from '../interfaces/validation-error.interface';
import { ValidationErrorsWithControl } from '../interfaces/validation-errors-recursive.interface';
import { List } from './list.class';
export declare class ReactiveArray<T = any> extends FormArray {
    value: T[];
    controls: ReactiveAbstract[];
    private _submitted;
    get submitted(): boolean;
    /**
     * returns list of errors based on errors property
     */
    get errorsList(): List<ValidationErrors>;
    submit(onSuccess?: (value: T[] | null) => void, onFailure?: (errors: ValidationErrors | null) => void): Promise<T[]>;
    /**
   * Returns full list of errors in form
   */
    getErrorsRecursively(): ValidationErrorsWithControl | null;
    removeDuplicates(keyFn: (arg: T) => string | number): void;
    reset(): void;
}
