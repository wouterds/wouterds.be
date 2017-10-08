class AdminSignUp
{
  constructor($scope) {
    if (!($scope && $scope.length)) {
      return;
    }

    $('form').on('submit', (e) => {
      e.preventDefault();

      let $form = $(e.target);

      $.ajax({
        url: $form.attr('action'),
        method: $form.attr('method'),
        data: $form.serializeArray()
      });
    });
  }
}

new AdminSignUp($('#pageAdminSignUp'));
