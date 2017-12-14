import $ from 'jquery';
import moment from 'moment';

class PageAbout {
  constructor() {
    let $scope = $('#pageAbout');

    if (!($scope && $scope.length === 1)) {
      return;
    }

    this.$scope = $scope;
  }

  init() {
    if (!this.$scope) {
      return;
    }

    this.$age = this.$scope.find('[data-id=age]');
    this.birthday = this.$age.data('birthday');

    setInterval(::this.updateAge, 100);
  }

  updateAge() {
    let age = moment().diff(moment.unix(this.birthday), 'years', true);
    age = Math.round(age * 1000000000) / 1000000000;
    age = age.toFixed(9);

    this.$age.text(age);
  }
}

export default PageAbout;
