'use babel';

import path from 'path'

import SlidesView from '../lib/slides-preview-view.js';

describe('SlidesView', () => {
  let slidesView

  beforeEach(() => {
    slidesView = new SlidesView(path.join(__dirname, '../example.md'))
  });

  it('can render', () => {
    expect(slidesView).toExist()
    expect(slidesView.getTitle()).toBe('slides-preview')
  });
});
