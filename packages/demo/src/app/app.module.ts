import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpShellModule } from '@jrel/http-shell';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, HttpShellModule, HttpClientModule, CdkTableModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
