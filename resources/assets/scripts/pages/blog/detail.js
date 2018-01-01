import Base from '../base';
import Highlight from 'highlight.js';
import MediumZoom from 'medium-zoom';

class BlogDetail extends Base {
  get pageId() {
    return '#pageBlogDetail';
  }

  init() {
    this.initHighlightJs();
    this.initMediumZoom();
  }

  initHighlightJs() {
    let $code = this.$scope.find('pre code');

    if ($code.length === 0) {
      return;
    }

    $code.each(function(i, block) {
      Highlight.highlightBlock(block);
    });
  }

  initMediumZoom() {
    MediumZoom('.media__image');
  }
}

export default BlogDetail;
