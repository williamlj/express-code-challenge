$(function() {

  var html = '', $bookthml = $('#booktemplate').html();
  $.get('/api/users')
  .done(function(r) {
    $.each(r, function (i, user) {
      html += $.supplant($bookthml, user);
    });
    $('#userlist').html(html);
    //initialize
    $('.collapsible').collapsible({onOpenStart: function (el) {
      var $el = $(el);
      $.get('/api/user/' + $el.attr('data-id') + '/books')
      .done(function (rb) {
        var lihtml = '';
        $.each(rb.books, function (j, book) {
          console.log(book);
          book.author = book.author.join(', ');
          lihtml += $.supplant('<li class="collection-item"><img src="{thumbnailUrl}" alt="Thumnbnail" /><h5>{title}</h5> by {author}</li>', book);
        });
        $el.find('div.collapsible-body>ul').html(lihtml);
        $('img').on('error', function(){
          $(this).attr('src', '/images/noimage.gif');
        });
      })
      .fail(function (err) {
        console.error(err);
      });
    }});
  })
  .fail(function(err) {
    console.error( "error", err );
  });
});
