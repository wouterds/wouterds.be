import $ from 'jquery';
import ServiceClipboard from './services/clipboard';
import ServiceEmoji from './services/emoji';
import PageAbout from './pages/about';
import PageContact from './pages/contact';
import PageBlogDetail from './pages/blog/detail';
import PageStats from './pages/stats';
import PageAdminUsersSignIn from './pages/admin/users/sign-in';
import PageAdminUsersSignUp from './pages/admin/users/sign-up';
import PageAdminMediaAdd from './pages/admin/media/add';
import PageAdminMediaIndex from './pages/admin/media/index';
import PageAdminBlogPost from './pages/admin/blog/post';

class App {
  constructor() {
    this.init();
  }

  init() {
    this.initPages();
    this.initServices();
  }

  initServices() {
    new ServiceEmoji();
    new ServiceClipboard();
  }

  initPages() {
    new PageAbout();
    new PageContact();
    new PageBlogDetail();
    new PageStats();
    new PageAdminUsersSignIn();
    new PageAdminUsersSignUp();
    new PageAdminMediaAdd();
    new PageAdminMediaIndex();
    new PageAdminBlogPost();
  }
}

new App();
