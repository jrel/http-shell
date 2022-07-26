import { HttpClient, HttpParams } from '@angular/common/http';
import {
  AfterViewInit,
  Directive,
  EmbeddedViewRef,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { Endpoints } from '@jrel/http-shell/endpoints';
import { ReplaySubject, Subscription } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';
import { Context } from '../interfaces';

@Directive({
  selector: '[httpShell]',
})
export class HttpShellDirective<
  URL extends keyof Endpoints = keyof Endpoints,
  R = Endpoints[URL]
> implements AfterViewInit, OnDestroy, OnChanges
{
  private readonly reload$ = new ReplaySubject<null>();
  private readonly subscription = new Subscription();

  @Input('httpShell') url!: URL;
  @Input('httpShellParams')
  params?:
    | HttpParams
    | Record<
        string,
        string | number | boolean | ReadonlyArray<string | number | boolean>
      >;
  @Input('httpShellVariables')
  variables?: Record<string, string>;

  @Input('httpShellLoading')
  loading?: TemplateRef<any>;

  @Input('httpShellError')
  error?: TemplateRef<any>;

  private currentView: EmbeddedViewRef<unknown> | null = null;
  constructor(
    private readonly http: HttpClient,
    private readonly template: TemplateRef<Context<R>>,
    private readonly viewContainer: ViewContainerRef
  ) {}

  static ngTemplateContextGuard<
    URL extends keyof Endpoints,
    R = Endpoints[URL]
  >(dir: HttpShellDirective<URL, R>, ctx: unknown): ctx is Context<R> {
    return true;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnChanges(): void {
    this.reload$.next(null);
  }
  ngAfterViewInit(): void {
    this.subscription.add(
      this.reload$
        .pipe(
          tap(() => {
            this.currentView?.destroy();
            this.currentView = this.createEmbeddedView(this.loading);
          }),

          switchMap(() =>
            this.http
              .get<R>(this.prepareUrl(), {
                observe: 'response',
                params: this.params,
              })
              .pipe(
                take(1),
                tap({
                  next: (res) => {
                    this.currentView?.destroy();
                    const context = {
                      status: res.status,
                      $implicit: res.body,
                    };
                    this.currentView = this.createEmbeddedView(
                      this.template,
                      context
                    );
                  },
                  error: () => {
                    this.currentView?.destroy();
                    this.currentView = this.createEmbeddedView(this.error);
                  },
                })
              )
          )
        )
        .subscribe()
    );
  }

  private prepareUrl(): string {
    const url = new URL(this.url);

    url.pathname = url.pathname.replace(
      /:([^/]+)/g,
      (_, key) => this.variables?.[key] ?? ''
    );
    return url.toString();
  }

  private createEmbeddedView<T>(
    template?: TemplateRef<T>,
    context?: T
  ): EmbeddedViewRef<T> | null {
    if (!template) return null;
    return this.viewContainer.createEmbeddedView<T>(template, context);
  }
}
