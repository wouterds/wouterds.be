import Base from './base';
import moment from 'moment';

class About extends Base {
  get pageId() {
    return '#pageAbout';
  }

  init() {
    this.$age = this.$scope.find('[data-id=age]');
    this.birthday = this.$age.data('birthday');

    setInterval(::this.updateAge, 100);
  }

  updateAge() {
    let age = moment().diff(moment.unix(this.birthday), 'years', true);
    age = age.toFixed(9);

    this.$age.text(age);
  }
}

export default About;
