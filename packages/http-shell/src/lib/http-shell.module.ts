import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import * as DIRECTIVES from './directives';

@NgModule({
  imports: [CommonModule],
  declarations: [
    DIRECTIVES.HttpShellDirective,
    DIRECTIVES.HttpShellErrorDirective,
    DIRECTIVES.HttpShellLoadingDirective,
  ],
  exports: [
    DIRECTIVES.HttpShellDirective,
    DIRECTIVES.HttpShellErrorDirective,
    DIRECTIVES.HttpShellLoadingDirective,
  ],
})
export class HttpShellModule {}
