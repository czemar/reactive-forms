import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export class ReactiveControl<T = any> extends FormControl {

  public value: T;

  private _submitted = false;

  public get submitted(): boolean {
    return this._submitted;
  }

  public submit(): void {
    this._submitted = true;

    this.markAllAsTouched();
  }

  public reset(): void {
    super.reset();
    this._submitted = false;
  }

}