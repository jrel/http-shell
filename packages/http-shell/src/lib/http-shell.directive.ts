import { HttpClient } from '@angular/common/http';
import { Directive, Input, OnDestroy, OnInit } from '@angular/core';
import { ReplaySubject, Subscription, switchMap, take, tap } from 'rxjs';

type URL = string;
type TRes = any;
@Directive({
  selector: '[httpShell]',
  standalone: true,
})
export class HttpShellDirective implements OnInit, OnDestroy {
  private readonly url$ = new ReplaySubject<URL>();
  private readonly subscription = new Subscription();

  @Input('httpShell') set url(url: string) {
    this.url$.next(url);
  }

  constructor(private readonly http: HttpClient) {}

  ngOnInit() {
    this.subscription.add(
      this.url$
        .pipe(
          switchMap((url) => this.http.get<TRes>(url)),
          take(1),
          tap((data) => console.log(data))
        )
        .subscribe()
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
