import { Component, OnInit } from '@angular/core';
import * as Tone from 'tone';
import * as p5 from 'p5';

@Component({
  selector: 'app-prueba',
  templateUrl: './prueba.component.html',
  styleUrls: ['./prueba.component.css']
})
export class PruebaComponent implements OnInit {
  ready: boolean;

  osc: any
  osc2: any;
  freq1: number;
  freq2: number;

  lfo: any;
  filter: any;

  constructor() {
    this.ready = false;

    this.osc = new Tone.Oscillator({
      type: "triangle",
      frequency: this.freq1,
      volume: -3
    });
    this.osc2 = new Tone.Oscillator({
      type: "square",
      frequency: this.freq2,
      volume: -3
    });
    this.lfo = new Tone.LFO("4n", 40, 50);
  }

  ngOnInit(): void {
    this.osc.toDestination()
    this.osc2.toDestination()
    this.lfo.connect(this.osc.frequency);

    const sketch = (s: p5) => {

      s.preload = () => {
        // preload code
      }

      s.setup = () => {
        s.createCanvas(s.windowWidth, 200);

        s.wave = new Tone.Waveform()
        Tone.Master.connect(s.wave)
      };

      s.windowResized = () => {
        s.resizeCanvas(s.windowWidth, 200)
      }

      s.draw = () => {
        s.background(0);
        if (this.ready) {

          this.osc.frequency.value = s.map(s.mouseX, 0, s.width, 110, 880);

          s.stroke(255);
          let buffer = s.wave.getValue(0);

          // look a trigger point where the samples are going from
          // negative to positive
          let start = 0;
          for (let i = 1; i < buffer.length; i++) {
            if (buffer[i - 1] < 0 && buffer[i] >= 0) {
              start = i;
              break;
            }
          }

          // calculate a new end point such that we always
          // draw the same number of samples in each frame
          let end = start + buffer.length / 2;

          // drawing the waveform
          for (let i = start; i < end; i++) {
            let x1 = s.map(i - 1, start, end, 0, s.width);
            let y1 = s.map(buffer[i - 1], -1, 1, 0, s.height);
            let x2 = s.map(i, start, end, 0, s.width);
            let y2 = s.map(buffer[i], -1, 1, 0, s.height);
            s.line(x1, y1, x2, y2);
          }
        } else {
          s.fill(255);
          s.noStroke();
          s.textAlign(s.CENTER, s.CENTER);
          s.text("CLICK PLAY TO START", s.width / 2, s.height / 2);
        }
      }
    }
    new p5(sketch);
  }

  mousePressed() {
    if (!this.ready) {
      // ! --> not
      // start our audio objects here

      this.osc.start();
      this.osc2.start();
      this.lfo.start();

      this.ready = true;
    }
    else {
      this.ready = false;
      this.osc.stop();
      this.osc2.stop();
      this.lfo.stop();
    }
  }

  changeFreq($event, osc) {
    console.log(this.freq1);
    osc === 1 ? this.lfo.min = $event.target.value : this.lfo.max = $event.target.value;
  }

  changeType($event, osc) {
    osc === 1 ? this.osc.type = $event.target.value : this.osc2.type = $event.target.value;
  }
}
