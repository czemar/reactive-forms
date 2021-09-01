import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

export class ReactiveControl<T = any> extends FormControl {

  public touched = false;
  public value: T;

  private _submitted = false;
  private _touchChanges = new BehaviorSubject<boolean>(false);

  public get submitted() {
    return this._submitted;
  }

  public get touchChanges(): BehaviorSubject<boolean> {
    return this._touchChanges;
  }

  public submit(): void {
    this._submitted = true;

    this.markAllAsTouched();
  }

  public markAsTouched(opts?: {
    onlySelf?: boolean;
  }): void {
    this.touched = true;
    super.markAsTouched(opts);

    this._touchChanges.next(true);
  }

  /**
   * @untested
   */
  public markAsUntouched() {
    this.touched = false;
    super.markAsUntouched();

    this._touchChanges.next(false);
  }

  public reset() {
    super.reset();
    this._submitted = false;
  }

}