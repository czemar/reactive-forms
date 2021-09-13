import { FormArray } from '@angular/forms';
import { ReactiveAbstract } from '../types/reactive-abstract.type';
import { ValidationErrors } from '../inerfaces/validation-error.interface';
import { ReactiveControl } from './reactive-control.class';
import { ReactiveGroup } from './ractive-group.class';
import { ValidationErrorsWithControl } from '../inerfaces/validation-errors-recursive.interface';

export class ReactiveArray<T = any> extends FormArray {

    public value: T[] = [];
    public controls: ReactiveAbstract[] = [];

    private _submitted = false;

    public get submitted(): boolean {
        return this._submitted;
    }

    public submit(onSuccess?: (value: T[] | null) => void, onFailure?: (errors: ValidationErrors | null) => void): Promise<T[]> {
        this._submitted = true;

        this.markAllAsTouched();

        for (const control of this.controls) {
            control.submit();
        }

        if (this.invalid) {
            onFailure?.(this.errors);
            return Promise.reject(this.errors);
        }
        onSuccess?.(this.value);
        return Promise.resolve(this.value);
    }

    /**
   * Returns full list of errors in form
   */
  public getErrorsRecursively(): ValidationErrorsWithControl | null {
    const errors: ValidationErrorsWithControl = {};

    if (!this.errors) return null;

    for (const key of Object.keys(this.errors)) {
      errors[key] = {
        ...this.errors[key],
        control: this
      }
    }

    const assign = (errorsToAssign: ValidationErrorsWithControl) => {
      for (let key of Object.keys(errorsToAssign)) {
        const value = errorsToAssign[key];

        while (Object.keys(errors).includes(key)) {
          key = `_${key}`;
        }

        Object.assign(errors, { [key]: value });
      }
    }

    for (const control of this.controls) {
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
            }
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

    public removeDuplicates(keyFn: (arg: T) => string | number): void {
        const keys = this.value.map(keyFn);

        for (let i = this.controls.length - 1; i >= 0; i--) {
            const val = this.controls[i].value;

            if (i !== keys.indexOf(keyFn(val))) {
                this.removeAt(i);
            }
        }
    }

    public reset(): void {
        super.reset();
        this._submitted = false;
    }

}
