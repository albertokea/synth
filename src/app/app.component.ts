import { Component } from '@angular/core';
import * as Tone from 'tone';
import * as p5 from 'p5';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Synth';

  ready: boolean;

}



