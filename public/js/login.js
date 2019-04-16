$(function() {
  $('#register').on('change', function () {
      $('#registerfields')[$(this).is(':checked')?'show':'hide']();
  });

  //Validate clientside first
  function signUpOrIn (e) {
      if (e.type !== 'click' && ($(e.target).is(':input') && e.which !== 13)) {
        return;
      }
      var url = '/users/signin';
      var loginerrors = [];
      var data = {
        email: $('#email').val(),
        password: $('#password').val(),
        username: $('#username').val()
      };
      if ($.trim(data.email) === '') {
          loginerrors.push('<br />Email is required.');
      }
      if ($.trim(data.password) === '') {
          loginerrors.push('<br />Password is required.');
      }
      if ($('#register').is(':checked') && $.trim(data.username) === '') {
          loginerrors.push('<br />Name is required.');
      }
      if (loginerrors.length > 0) {
          M.toast({html: 'Please correct the following:' + loginerrors.join(''), classes: 'rounded red'});
          return false;
      }
      if ($('#register').is(':checked')) {
        url = '/users/create'
      }
      console.log('sending data', data);
      $.ajax({
          'url': url,
          'method': 'POST',
          'data': data
      }).done(function (r) {
        console.log(r);
        if (r.status && r.status === 'error') {
          M.toast({html: r.data.title, classes: 'rounded red'});
          return false;
        }
        window.location.replace('/profile');
      }).fail(function (err) {
        console.log('error', err);
        M.toast({html: 'An error occurred. Please try again.', classes: 'rounded red'});
      });

  }
  $('a.btn').on('click', signUpOrIn);
  $('div.input-field').on('keyup', signUpOrIn);
});
