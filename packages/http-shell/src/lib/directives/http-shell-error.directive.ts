import { Directive } from '@angular/core';
import { Context } from '../interfaces';
import { TemplateDirective } from './template.directive';

@Directive({
  selector: 'ng-template[httpShellError]',
})
export class HttpShellErrorDirective extends TemplateDirective<
  Context<unknown>
> {}
