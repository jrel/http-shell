import { Directive } from '@angular/core';
import { TemplateDirective } from './template.directive';

@Directive({
  selector: 'ng-template[httpShellLoading]',
})
export class HttpShellLoadingDirective extends TemplateDirective<unknown> {}
