import { Component, OnInit } from '@angular/core';
import {SafeResourceUrlPipe} from 'src/app/pipes/safe-resource-url.pipe';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';



@Component({
  selector: 'app-blogs-by-category',
  templateUrl: './blogs-by-category.component.html',
  styleUrls: ['./blogs-by-category.component.scss'],
  providers: [SafeResourceUrlPipe]
})
export class BlogsByCategoryComponent implements OnInit {
  productImages =[];
  currentlyUploadedImageSrc = [];

  constructor(
    private safeResourceUrl: SafeResourceUrlPipe,
    private formBuilder: FormBuilder
    ) { }

  urls = [];

  allowDrop(event: Event) {
    event.preventDefault();
  }

  drag(event: DragEvent) {
    event.dataTransfer!.setData('text', (event.currentTarget['parentElement'] as HTMLElement).id);
  }

  drop(event: DragEvent) {
    event.preventDefault();
    const data = event.dataTransfer!.getData('text');
    const dropzone = event.target as HTMLElement;
    dropzone.appendChild(document.getElementById(data)!);
  }

  // choose photos
  onselectFile(e: any) {
    if (e.target.files) {
      for (let i = 0; i <  e.target.files.length; i++) {
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload = (events: any) => {
          this.urls.push(events.target.result);
        }
      }
    }
  }

  setCurrentlyUploadedImgArr(file) {
    let imgSrc=URL.createObjectURL(file)
    this.currentlyUploadedImageSrc.push(imgSrc);
  }

  getFiles(event) {
    this.productImages=[];
    for (var i = 0; i < event.target.files.length; i++) {
      this.productImages.push(event.target.files[i]);
      this.setCurrentlyUploadedImgArr(event.target.files[i]);
          // this.setCurrentlyUploadedImgArr(event.target.files[i])
    }
  }

  // angular editor
  

  form: FormGroup;

  htmlContent1 = '';
  htmlContent2 = '';

  config1: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: 'auto',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: false,
    // toolbarPosition: 'top',
    outline: true,
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    // showToolbar: false,
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    toolbarHiddenButtons: [
      ['bold', 'italic'],
      ['fontSize']
    ]
  };

  config2: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    minHeight: '5rem',
    maxHeight: '15rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    sanitize: true,
    toolbarPosition: 'bottom',
    defaultFontName: 'Comic Sans MS',
    defaultFontSize: '5',
    defaultParagraphSeparator: 'p',
    customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ]
  };


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      signature: ['', Validators.required]
    });
    console.log(this.htmlContent1);
  }

  onChange(event) {
    console.log('changed');
  }

  onBlur(event) {
    console.log('blur ' + event);
  }

  onChange2(event) {
    console.warn(this.form.value);
  }

}
