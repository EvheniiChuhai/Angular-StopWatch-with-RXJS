import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {fromEvent, merge, of, timer} from "rxjs";
import {buffer, debounceTime, distinctUntilChanged, filter, map, mapTo, scan, switchMap} from "rxjs/operators";
import {Control} from "./control";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('start', {static: true}) startButton: ElementRef;
  @ViewChild('wait', {static: true}) waitButton: ElementRef;
  @ViewChild('reset', {static: true}) resetButton: ElementRef;
  @ViewChild('stop', {static: true}) stopButton: ElementRef;
  title = 'stopwatch';
  v:  number = 0;
  constructor() {

  }

  ngOnInit() {

    let waitEvent$ = fromEvent(this.waitButton.nativeElement, 'click')
    const buff$ = waitEvent$.pipe(
      debounceTime(299),
    )
    const click$ = waitEvent$.pipe(
      buffer(buff$),
      map(list => {
        return list.length;
      }),
      filter(x => x === 2),
    )
    const stop$ = fromEvent(this.stopButton.nativeElement, 'click').pipe(
      mapTo({count: false, pause: false, value: 0,})
    )
    const start$ = fromEvent(this.startButton.nativeElement, 'click').pipe(
      mapTo({count: true, pause: false, })
    )

    const reset$ = fromEvent(this.resetButton.nativeElement, 'click').pipe(
      mapTo({count: true, pause: false, value: 0,})
    )
    const wait$ = click$.pipe(
      mapTo({count: false, pause: true,}),

    )

    let events$ = merge(
      reset$,
      wait$,
      start$,
      stop$
    )
    events$.pipe(
      distinctUntilChanged(),
      scan((control: Control, current): Control => ({...control, ...current}),{count: false, pause:false, value: 0}),
      switchMap((control: Control) => {
        if (control.count) {
          return timer(0, 1000).pipe(
            mapTo(1),
            scan((acc, curr) => control.value++, 0)
          )

        }
          return of(control.value -1)
      }),
    ).subscribe((v) =>  {
      this.v = v;
      });
  }
}
