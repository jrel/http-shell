import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpShellDirective } from './http-shell.directive';

@NgModule({
  imports: [CommonModule, HttpShellDirective],
  exports: [HttpShellDirective],
})
export class HttpShellModule {}
