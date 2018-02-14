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
      },
      attributes: (rawText, iconId) => {
        return {
          title: `Emoji: ${rawText}, emoji id: ${iconId}`,
          width: 16,
          height: 16,
        };
      },
    });
  }
}

export default Emoji;
