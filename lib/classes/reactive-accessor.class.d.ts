import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';
import { ReactiveControl } from './reactive-control.class';
export declare abstract class ReactiveAccessor<T = string> implements ControlValueAccessor, OnInit, OnDestroy {
    control: ReactiveControl<T>;
    label: string;
    valueChanges: EventEmitter<T>;
    private _touchChangesSubscription?;
    private _valueChangesSubscrition?;
    private _onTouched;
    private _onChange;
    ngOnDestroy(): void;
    ngOnInit(): void;
    writeValue(value: T): void;
    registerOnChange(fn: (_: T) => {}): void;
    registerOnTouched(fn: () => {}): void;
    setEnabledState(isEnabled: boolean): void;
    disable(): void;
    enable(): void;
}
