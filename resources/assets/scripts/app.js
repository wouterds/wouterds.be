import $ from 'jquery';
import Twemoji from 'twemoji';
import Clipboard from 'clipboard';
import PageAbout from './pages/about';
import PageContact from './pages/contact';
import PageBlogDetail from './pages/blog/detail';
import PageAdminUsersSignIn from './pages/admin/users/sign-in';
import PageAdminUsersSignUp from './pages/admin/users/sign-up';
import PageAdminMediaAdd from './pages/admin/media/add';
import PageAdminBlogPost from './pages/admin/blog/post';

class App {
  constructor() {
    this.init();
  }

  init() {
    this.initPages();
    this.initTwemoji();
    this.initClipboard();
  }

  initPages() {
    new PageAbout();
    new PageContact();
    new PageBlogDetail();
    new PageAdminUsersSignIn();
    new PageAdminUsersSignUp();
    new PageAdminMediaAdd();
    new PageAdminBlogPost();
  }

  initTwemoji() {
    Twemoji.parse($('main')[0], {
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

  initClipboard() {
    $('[data-clipboard-text]').each((index, el) => {
      $(el).css('cursor', 'pointer');
      new Clipboard(el);
    });
  }
}

new App();
