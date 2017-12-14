import PageAbout from './pages/about';
import PageContact from './pages/contact';

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
  }
}

new App();
