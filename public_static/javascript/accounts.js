
$(document).ready(function () {
  
  $.get('/users', function (response) {
    var list = $('#all-accounts > ol');
    for (let i = 0; i < response.length; i++) {
      li = "<li>" + response[i] + "</li>";
      list.append(li)
    }
  })

  $('#register').click(function () {
    $('#status').text("registering...");
    let frameNumber = $('#frameNumber').val();
    let receiver = $('#receiver').val();
    $.post('/register', { frameNumber: frameNumber, receiver: receiver }, function (response) {
      $('#registerResult').text(JSON.stringify(response));
      $('#status').text("Sent!!");
    })
  });
})
