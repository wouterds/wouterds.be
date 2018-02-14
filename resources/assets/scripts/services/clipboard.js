import $ from 'jquery';
import clipboard from 'clipboard';

class Clipboard {
  constructor() {
    $('[data-clipboard-text]').each((index, el) => {
      $(el).css('cursor', 'pointer');
      new clipboard(el);
    });
  }
}

export default Clipboard;
