import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import {
  faBold,
   faAlignRight,
    faAlignLeft,
     faAlignCenter,
      faUnderline,
       faItalic,
        faLink,
         faPalette
           } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-txt-editor',
  templateUrl: './txt-editor.component.html',
  styleUrls: ['./txt-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TxtEditorComponent),
      multi: true
    }
  ]
})
export class TxtEditorComponent implements OnInit, ControlValueAccessor {
  faBold = faBold;
  faUnderline = faUnderline;
  faItalic = faItalic;
  faLink = faLink;
  faPalette = faPalette;
  faAlignRight = faAlignRight;
  faAlignLeft = faAlignLeft;
  faAlignCenter = faAlignCenter;

  inputContainer: HTMLElement;
  inputType: string;
  input: string;
  inputPlaceholder = {
    backColor: 'Color Name, RGB or Hex',
    createLink: 'Link to attach'
  };

  script: Element;

  constructor() {}

  propagateChange = (_: any) => {};

  onScriptEdit() { this.propagateChange(this.script.innerHTML); }

  writeValue(script: any) {
    if (script !== undefined) {
      this.script.innerHTML = script;
    }
  }

  registerOnChange(fn: (_: any) => void) {
    this.propagateChange = fn;
  }

  registerOnTouched() {}

  onStyle(arg: string) {
    document.execCommand(arg, false, '');
  }

  onInputShow(inputType: string) {
    this.inputType = inputType;
    this.inputContainer.style['display'] = 'block';
    const inputControl = document.getElementsByName('unknownInputType')[0];
    (<HTMLInputElement>inputControl).placeholder = this.inputPlaceholder[inputType];
    inputControl.id = inputType;
    inputControl.focus();
  }

  onInputAttach() {
    document.execCommand(this.inputType, false, this.input);
    this.inputContainer.style['display'] = 'none';
    document.getElementById(this.inputType).id = 'unknownInputType';
    this.input = '';
  }

  ngOnInit() {
    this.inputContainer = document.getElementById('input-container');
    this.script = document.getElementsByName('script')[0];
  }
}
