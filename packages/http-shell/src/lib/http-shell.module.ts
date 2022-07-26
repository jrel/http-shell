import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import * as DIRECTIVES from './directives';

@NgModule({
  imports: [CommonModule],
  declarations: [DIRECTIVES.HttpShellDirective],
  exports: [DIRECTIVES.HttpShellDirective],
})
export class HttpShellModule {}
