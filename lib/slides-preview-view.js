'use babel';

import * as Remark from './remark-latest.min.js'
import {$, ScrollView} from 'atom-space-pen-views'
import {Point, Range} from 'atom'

export default class SlidesView extends ScrollView{

  static content(){
    return this.div({"id":"slides-container"})
  }

  constructor(id) {
    super();
    console.log('constructor with editorId:', id);
    this.editorId = id;
  }

  // Returns an object that can be retrieved when package is activated
  serialize() {}

  // Tear down any state and detach
  destroy() {
  }

  lookupEditor(id) {
    editors = atom.workspace.getTextEditors();
    for (let editor of editors) {
      console.log('search', editor, this.editorId);
      if (editor.id == this.editorId){
        console.log('found', editor.id);
        return editor
      }
    }
  }
  trackSlide() {
    let count = 0
    let cur = this.editor.getCursorBufferPosition()
    let range = new Range(new Point(0, 1), cur)
    this.editor.scanInBufferRange(/(?:^|\n)(---?)(?:\n|$)/g, range,
      (found) => {
        console.log("match range ", found.range);
        count += 1
      })
    console.log("match count", count);
    this.slideShow.gotoSlide(count+1)
  }
  renderSlide() {
    $('#slides-show').remove()
    this.editor = this.lookupEditor(this.editorId)
    console.log(this.editor);
    container = $('<div id="slides-show" style="height:100%; width:100%; position:absolute; top:0"></div>').appendTo(this.element)
    text = this.editor.getText();
    this.slideShow = window.remark.create({
      "source":text,
      "container":container[0]
    })
    this.trackSlide()
  }

  getTitle(){
    if (this.editor){
      return this.editor.getTitle()+" preview"
    }
    return "slides-preview"
  }
  getUri(){
    return "slides-preview://editor/"+this.editorId
  }
}
