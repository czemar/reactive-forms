import { FormArray } from '@angular/forms';
import { ReactiveAbstract } from '../types/reactive-abstract.type';
import { ValidationErrors } from '../inerfaces/validation-error.interface';

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
