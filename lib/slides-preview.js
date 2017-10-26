'use babel';

import SlidesView from './slides-preview-view';
import { CompositeDisposable } from 'atom';
import Url from 'url';

export default {

  slidesView: null,
  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.watchers = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'slides-preview:toggle': () => this.toggle()
    }));

    atom.workspace.addOpener((uri) => {
      console.log(uri);
      u = Url.parse(uri)
      console.log(u);
      if (u.protocol === "slides-preview:" && u.host === 'editor'){
        console.log('protocol match, open by slides');
        return new SlidesView(u.path.slice(1))
      }
    })
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
  },

  toggle() {
    console.log('Slides was toggled!');

    editor = atom.workspace.getActiveTextEditor()
    if (editor == null) {
      console.error('No editor present');
      return
    }

    uri = "slides-preview://editor/"+editor.id
    console.log("uri", uri);
    target = atom.workspace.paneForURI(uri)
    if (target) {
      target.destroyItem(target.itemForURI(uri))
      this.watchers.dispose()
      return
    }

    origin = atom.workspace.getActivePane()
    console.log("origin pane", origin);
    atom.workspace.open(uri, {split:"right", searchAllPanes: true}).then( (v) => {
       if (v instanceof SlidesView) {
         console.log(v);
         v.renderSlide()
         this.watchers.add(editor.onDidStopChanging(()=>{v.renderSlide()}))
         this.watchers.add(editor.onDidChangeCursorPosition(()=>{v.trackSlide()}))
         origin.activate()
       }
    })
  }
};
