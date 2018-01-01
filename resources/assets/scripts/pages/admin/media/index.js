import $ from 'jquery';
import Base from '../../base';

class Index extends Base {
  get pageId() {
    return '#pageAdminMediaIndex';
  }

  init() {
    this.$scope.find('[data-media-path]').on('mouseover', ::this.onMouseOver);
    this.$scope.find('[data-media-path]').on('mouseout', ::this.onMouseOut);
  }

  onMouseOver(e) {
    let $this = $(e.target);

    let $img = $('<img />');
    $img.attr('src', $this.data('media-path'));
    $img.attr('class', 'image-preview');

    $this.append($img);
  }

  onMouseOut(e) {
    let $this = $(e.target);

    $this.find('img').remove();
  }
}

export default Index;
