import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  prefixHelper(value:number){
    if(value<10){
      return `0${value}`
    }
    return value
  }

  transform(value:number) {


    let hours: string | number   = Math.floor(value / 3600); // get hours
    let minutes: string | number = Math.floor((value - (hours * 3600)) / 60); // get minutes
    let seconds: string | number = value - (hours * 3600) - (minutes * 60); //  get seconds
    // add 0 if value < 10; Example: 2 => 02
    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds; // Return is HH : MM : SS
  }

}
