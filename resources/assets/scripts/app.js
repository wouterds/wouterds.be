import PageAbout from './pages/about';
import PageContact from './pages/contact';
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
  }

  initPages() {
    new PageAbout();
    new PageContact();
    new PageAdminUsersSignIn();
    new PageAdminUsersSignUp();
    new PageAdminMediaAdd();
    new PageAdminBlogPost();
  }
}

new App();
