import twemoji from 'twemoji';

class Emoji {
  constructor() {
    twemoji.parse(document.body.getElementsByTagName('main')[0], {
        folder: 'svg',
        ext: '.svg',
        callback: function (icon, options) {
          switch (icon) {
            case 'a9': // © copyright
            case 'ae': // ® registered trademark
            case '2122': // ™ trademark
              return false;
          }

          return ''.concat(options.base, options.size, '/', icon, options.ext);
        }
      });
  }
}

export default Emoji;
