$('#userbooks').load('/books', function () {
  console.log('JSON loaded');
  $('#booksmessage').html('Below is the JSON response to a call to "/books" for the authenticated user.');
});
