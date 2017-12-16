import PageAbout from './pages/about';
import PageContact from './pages/contact';
import PageAdminSignIn from './pages/admin/sign-in';
import PageAdminSignUp from './pages/admin/sign-up';

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
    new PageAdminSignIn();
    new PageAdminSignUp();
  }
}

new App();
