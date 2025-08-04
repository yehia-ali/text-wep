import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DomSanitizer} from "@angular/platform-browser";
import * as RecordRTC from "recordrtc";
import {TranslateModule} from "@ngx-translate/core";

@Component({
  selector: 'record',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit, OnDestroy, OnChanges {
  @Output() soundDescription = new EventEmitter();
  @Output() isRecording = new EventEmitter();
  @Input() url: any;
  @Input() forChat = false;

  record: any;
  recording = false;
  recorded = false;
  error: any;
  stream: any;
  timing = 0;
  minutes = 0;
  seconds = 0;
  interval!: any;
  isDeleted = false;

  constructor(private domSanitizer: DomSanitizer) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.url) {
      this.soundDescription.emit(this.url)
    }
  }

  ngOnInit(): void {
  }

  startRecording() {
    this.interval = setInterval(() => {
      this.timing++
      this.minutes = Math.trunc(this.timing / 60);
      this.seconds = Math.trunc(this.timing - (this.minutes * 60));
    }, 1000);
    this.recording = true;
    this.isRecording.emit(true);
    let mediaConstraints = {
      video: false,
      audio: true,
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }

  successCallback(stream: any) {
    this.stream = stream;
    let options: any = {
      mimeType: "audio/wav",
      numberOfAudioChannels: 1,
    };

    let StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
    this.record = new StereoAudioRecorder(stream, options);
    this.record.record();
  }

  errorCallback(error: any) {
    this.error = "Can not play audio in your browser";
  }

  stopRecording() {
    this.timing = 0;
    this.minutes = 0;
    this.seconds = 0;
    clearInterval(this.interval);
    this.record.stop(this.processRecording.bind(this));
    this.stream.getAudioTracks().forEach(function (track: any) {
      track.stop();
    });
  }

  processRecording(blob: any) {
    if (!this.isDeleted) {
      this.url = this.sanitize(URL.createObjectURL(blob));
      let filename = 'sound' + Date.now() + '.mp3'
      let file = new File([blob], filename, {type: 'audio/mp3'})
      this.soundDescription.emit(file);
      this.recording = false;
      this.isRecording.emit(false)
      this.recorded = true;
    }
  }

  sanitize(url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  deleteRecording() {
    this.url = null;
    this.recording = false;
    this.isRecording.emit(false)
    this.recorded = false;
    if (!this.isDeleted) {
      this.soundDescription.emit('')
    }
  }

  stopAndDelete() {
    if (this.recording) {
      this.isDeleted = true;
      this.stopRecording();
      this.deleteRecording();
      setTimeout(() => {
        this.isDeleted = false
      }, 1000)
    }
  }

  ngOnDestroy() {
    this.stopAndDelete()
  }
}
