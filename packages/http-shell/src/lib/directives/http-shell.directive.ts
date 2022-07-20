import { HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  ContentChild,
  Directive,
  EmbeddedViewRef,
  Input,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Endpoints } from '@jrel/http-shell/endpoints';
import { ReplaySubject, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { HttpShellErrorDirective, HttpShellLoadingDirective } from '.';
import { Context } from '../interfaces';
import { TemplateDirective } from './template.directive';

@Directive({
  selector: '[httpShell]',
})
export class HttpShellDirective<URL extends keyof Endpoints, R = Endpoints[URL]>
  extends TemplateDirective<Context<R>>
  implements AfterViewInit, OnDestroy
{
  private readonly url$ = new ReplaySubject<URL>();
  private readonly subscription = new Subscription();

  @Input('httpShell') set url(url: URL) {
    this.url$.next(url);
  }
  @ContentChild(HttpShellLoadingDirective) loading?: HttpShellLoadingDirective;
  @ContentChild(HttpShellErrorDirective) error?: HttpShellErrorDirective;
  constructor(
    private readonly http: HttpClient,
    template: TemplateRef<Context<R>>,
    private readonly viewContainer: ViewContainerRef
  ) {
    super(template);
  }

  static ngTemplateContextGuard<
    URL extends keyof Endpoints,
    R = Endpoints[URL]
  >(dir: HttpShellDirective<URL, R>, ctx: unknown): ctx is Context<R> {
    return true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    const loadingView = this.createEmbeddedView(this.loading);
    this.subscription.add(
      this.url$
        .pipe(
          switchMap((url) =>
            this.http.get<R>(url, { observe: 'response' }).pipe(
              take(1),
              tap({
                next: (res) => {
                  loadingView?.destroy();
                  const context = {
                    status: res.status,
                    $implicit: res.body,
                  };
                  this.createEmbeddedView(this, context);
                },
                error: () => {
                  loadingView?.destroy();
                  this.createEmbeddedView(this.error);
                },
              })
            )
          )
        )
        .subscribe()
    );
  }

  private createEmbeddedView<T>(
    dir?: TemplateDirective<T>,
    context?: T
  ): EmbeddedViewRef<T> | null {
    if (!dir) return null;
    return this.viewContainer.createEmbeddedView<T>(dir.template, context);
  }
}
