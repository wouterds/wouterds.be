import Base from '../base';
import Highlight from 'highlight.js';

class BlogDetail extends Base {
  get pageId() {
    return '#pageBlogDetail';
  }

  init() {
    this.initHighlightJs();
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
}

export default BlogDetail;
