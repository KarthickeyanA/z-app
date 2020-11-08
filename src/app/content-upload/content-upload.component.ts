import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as uuid from 'uuid';

@Component({
  selector: 'app-content-upload',
  templateUrl: './content-upload.component.html',
  styleUrls: ['./content-upload.component.css']
})
export class ContentUploadComponent implements OnInit {
  @Output() collections = new EventEmitter<any>();
  contentType = 'video';
  contentName;
  description;
  contentGenre;
  language;
  lastUploadContent;
  constructor() { }

  ngOnInit() {
  }

  fileUpload(event) {
    // tslint:disable-next-line:variable-name
    const _this = this;
    if (event.target.files[0]) {
      const file = event.target.files[0];
      const fileReader = new FileReader();
      if (file.type.match('image')) {
        // tslint:disable-next-line:only-arrow-functions
        fileReader.onload = function() {
          const img = document.createElement('referenceImage') as HTMLImageElement;
          img.src = fileReader.result.toString();
          document.getElementsByTagName('div')[0].appendChild(img);
        };
        fileReader.readAsDataURL(file);
      } else {
        // tslint:disable-next-line:only-arrow-functions
        fileReader.onload = function() {
          const blob = new Blob([fileReader.result], { type: file.type });
          const url = URL.createObjectURL(blob);
          const video = document.createElement('video');
          // tslint:disable-next-line:only-arrow-functions
          const timeupdate = function() {
            if (snapImage()) {
              video.removeEventListener('timeupdate', timeupdate);
              video.pause();
            }
          };
          video.addEventListener('loadeddata', () => {
            if (snapImage()) {
              video.removeEventListener('timeupdate', timeupdate);
            }
          });
          // tslint:disable-next-line:only-arrow-functions
          const snapImage = function() {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
            const image = canvas.toDataURL();
            _this.lastUploadContent = image;
            const success = image.length > 100000;
            if (success) {
              const img = document.getElementById('referenceImage') as HTMLImageElement;
              img.src = image;
              // document.getElementsByTagName('div')[0].appendChild(img);
              URL.revokeObjectURL(url);
            }
            return success;
          };
          video.addEventListener('timeupdate', timeupdate);
          video.preload = 'metadata';
          video.src = url;
          // Load video in Safari / IE11
          video.muted = true;
          // video.playsInline = true;
          video.play();
        };
        fileReader.readAsArrayBuffer(file);
      }
    }
  }

  onSubmit() {
    if (this.contentGenre && this.contentName && this.description && this.language) {
      if (this.lastUploadContent) {
        const newCategory = {
          contentType: this.contentType, name: this.contentName, description: this.description,
          updatedDate: new Date().getTime(), genre: this.contentGenre, language: this.language,
          ratings: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, users: [] },
          contentId: uuid.v4().replace(/-/g, ''), referenceImage: this.lastUploadContent
        };
        const existingData = JSON.parse(window.localStorage.getItem('contents'));
        if (existingData) {
          existingData.push(newCategory);
          window.localStorage.setItem('contents', JSON.stringify(existingData));
          setTimeout(() => {
            this.collections.emit(existingData);
          }, 1000);
        } else {
          window.localStorage.setItem('contents', JSON.stringify([newCategory]));
          setTimeout(() => {
            this.collections.emit([newCategory]);
          }, 1000);
        }
        this.resetValues();
        alert('Thanks for adding new content');
      } else {
        alert('please upload the video content');
      }
    } else {
      alert('please fill the missed column');
    }
  }

  resetValues() {
    this.contentGenre = '';
    this.contentName = '';
    this.description = '';
    this.language = '';
    const imageElement = document.getElementById('referenceImage') as HTMLImageElement;
    imageElement.src = '';
    this.lastUploadContent = '';
  }
}
