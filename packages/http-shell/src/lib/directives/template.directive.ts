import { Directive, TemplateRef } from '@angular/core';

@Directive()
export abstract class TemplateDirective<T> {
  constructor(readonly template: TemplateRef<T>) {}
}
