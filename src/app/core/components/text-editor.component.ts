import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import {
  ClassicEditor,
	AccessibilityHelp,
	Alignment,
	AutoLink,
	Autosave,
	Bold,
	Essentials,
	FontBackgroundColor,
	FontColor,
	FontSize,
	Heading,
	Highlight,
	HorizontalLine,
	Indent,
	IndentBlock,
	Italic,
	Link,
	List,
	Mention,
	Paragraph,
	RemoveFormat,
	SelectAll,
	Strikethrough,
	Table,
	TableCaption,
	TableCellProperties,
	TableColumnResize,
	TableProperties,
	TableToolbar,
	Underline,
	Undo,
} from 'ckeditor5';

@Component({
  selector: 'text-editor',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CKEditorModule
  ],
  template: `
    <div [formGroup]="formGroup" class="task-editor">
      <ckeditor
        [editor]="Editor"
        [config]="config"
        formControlName="{{ formControlName }}"
      ></ckeditor>
    </div>
  `,
  styles: [
    `
    :host ::ng-deep .ck-editor__editable {
      min-height: 150px;
      max-height: 300px;
      a{
        text-decoration: underline !important;
        color: #3f51b5 !important;
      }
    }
    `
  ]
})
export class TextEditorComponent implements OnInit {
  @Input() formGroup!: FormGroup; // Parent form group
  @Input() formControlName!: string; // Form control name to bind the editor
  @Input() language: string = 'en'; // Language setting, default to English

  public Editor = ClassicEditor;

public config:any = {
  toolbar: {
    items: [
      'undo',
      'redo',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      'removeFormat',
      'alignment',
      '|',
      'fontSize',
      'fontColor',
      'fontBackgroundColor',
      '|',
      'bulletedList',
      'numberedList',
      'outdent',
      'indent',
      '|',
      'heading',
      'horizontalLine',
      'link',
      'insertTable',
      'highlight',
    ],
    shouldNotGroupWhenFull: false
  },
  language: 'ar',
  plugins: [
    AccessibilityHelp,
    Alignment,
    AutoLink,
    Autosave,
    Bold,
    Essentials,
    FontBackgroundColor,
    FontColor,
    FontSize,
    Heading,
    Highlight,
    HorizontalLine,
    Indent,
    IndentBlock,
    Italic,
    Link,
    List,
    Mention,
    Paragraph,
    RemoveFormat,
    SelectAll,
    Strikethrough,
    Table,
    TableCaption,
    TableCellProperties,
    TableColumnResize,
    TableProperties,
    TableToolbar,
    Underline,
    Undo
  ],

  link: {
    addTargetToExternalLinks: true, // افتراضياً يفتح الروابط الخارجية في علامة تبويب جديدة
    decorators: {
      openInNewTab: {
        mode: 'manual',
        label: 'Open in new tab',
        attributes: {
          target: '_blank',
          rel: 'noopener noreferrer'
        }
      },
      openInSameTab: {
        mode: 'manual',
        label: 'Open in same tab',
        attributes: {
          target: '_self'
        }
      }
    }
  },

  fontSize: {
    options: [10, 12, 14, 'default', 18, 20, 22],
    supportAllValues: true
  },
  heading: {
    options: [
      {
        model: 'paragraph',
        title: 'Paragraph',
        class: 'ck-heading_paragraph'
      },
      {
        model: 'heading1',
        view: 'h1',
        title: 'Heading 1',
        class: 'ck-heading_heading1'
      },
      {
        model: 'heading2',
        view: 'h2',
        title: 'Heading 2',
        class: 'ck-heading_heading2'
      },
      {
        model: 'heading3',
        view: 'h3',
        title: 'Heading 3',
        class: 'ck-heading_heading3'
      },
      {
        model: 'heading4',
        view: 'h4',
        title: 'Heading 4',
        class: 'ck-heading_heading4'
      },
      {
        model: 'heading5',
        view: 'h5',
        title: 'Heading 5',
        class: 'ck-heading_heading5'
      },
      {
        model: 'heading6',
        view: 'h6',
        title: 'Heading 6',
        class: 'ck-heading_heading6'
      }
    ]
  },
};


  ngOnInit() {
    // Ensure the formControlName is defined in the parent form group
    if (!this.formGroup.controls[this.formControlName]) {
      throw new Error(`Form control with name ${this.formControlName} does not exist in the parent form group`);
    }
  }
}
