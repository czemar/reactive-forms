"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactiveAccessor = void 0;
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const reactive_control_class_1 = require("./reactive-control.class");
let ReactiveAccessor = 
// tslint:disable-next-line: component-class-suffix
class ReactiveAccessor {
    constructor() {
        this.control = new reactive_control_class_1.ReactiveControl('');
        this.label = '';
        this.valueChanges = new core_1.EventEmitter();
        this._onTouched = () => { };
        this._onChange = (_) => { };
    }
    ngOnDestroy() {
        var _a, _b;
        (_a = this._touchChangesSubscription) === null || _a === void 0 ? void 0 : _a.unsubscribe();
        (_b = this._valueChangesSubscrition) === null || _b === void 0 ? void 0 : _b.unsubscribe();
    }
    ngOnInit() {
        this._touchChangesSubscription = this.control.statusChanges.pipe((0, rxjs_1.delay)(50)).subscribe(() => {
            if (this.control.touched) {
                this._onTouched();
            }
        });
        this._valueChangesSubscrition = this.control.valueChanges.subscribe((val) => {
            this.valueChanges.emit(val);
            this._onChange(val);
        });
    }
    writeValue(value) {
        this.control.setValue(value);
    }
    registerOnChange(fn) {
        this._onChange = fn;
    }
    registerOnTouched(fn) {
        this._onTouched = fn;
    }
    setEnabledState(isEnabled) {
        if (isEnabled) {
            this.control.enable();
        }
        else {
            this.control.disable();
        }
    }
    disable() {
        this.setEnabledState(false);
    }
    enable() {
        this.setEnabledState(true);
    }
};
__decorate([
    (0, core_1.Input)()
], ReactiveAccessor.prototype, "control", void 0);
__decorate([
    (0, core_1.Input)()
], ReactiveAccessor.prototype, "label", void 0);
__decorate([
    (0, core_1.Output)()
], ReactiveAccessor.prototype, "valueChanges", void 0);
ReactiveAccessor = __decorate([
    (0, core_1.Component)({
        template: ''
    })
    // tslint:disable-next-line: component-class-suffix
], ReactiveAccessor);
exports.ReactiveAccessor = ReactiveAccessor;
