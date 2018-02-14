
$(document).ready(function() {

  // update output area with status of running command for this session
  function updateStatus() {
    var getStatusEndpoint = '/playgound-api/java/getstatus';
    var clearStatusEndpoint = '/playgound-api/java/clearstatus';

    $.ajax({
      type: "GET",
      url: getStatusEndpoint,
      dataType: "text"
    }).done (function (data) {

      $('#textRunOutput').text(data);
      $('#textRunOutput').animate({scrollTop: $('#textRunOutput').prop("scrollHeight")}, 500);

      if (data.indexOf("[EXIT]") >= 0)
      {
        $('#buttonRun').removeClass('disabled');
        $('#textRunOutput').removeClass('hide-element');

        // show 'congrats' message if there were no errors
        if (data.indexOf("[ERROR]") == -1)
        {
          $('#textSuccess').removeClass('hide-element');
        }

        // clear status from server
        $.ajax({
          type: "GET",
          url: clearStatusEndpoint,
          dataType: "text"
        });
      }
      else
      {
        // poll endpoint every 1 second for status message
        setTimeout(updateStatus, 1000);
      }
    });
  }
  
  // onclick handler
  $('#buttonRun').click(function(e) {

    $('#buttonRun').addClass('disabled');
    $('#textSuccess').addClass('hide-element');
    $('#textRunOutput').text('Running in playground, one moment...');

    var restEndpoint = $(this).data("value1"); // url
    var restVerb = $(this).data("value2"); // verb

    $.ajax({
      type: restVerb,
      url: restEndpoint,
      dataType: "text"
    }).done (function (data) {
      setTimeout(updateStatus(), 5000);
    });
  });

  // Java playground scripts - java-play-3 - submit form
  $('#frmRunApp2').submit(function(e) {

    var frm = $('#frmRunApp2');
    e.preventDefault();

    $('#buttonRun').addClass('disabled');
    $('#textSuccess').addClass('hide-element');
    $('#textRunOutput').text('Running in playground, one moment...');

    $.ajax({
      type: frm.attr('method'),
      url: frm.attr('action'),
      data: frm.serialize()
    }).done (function(data) {

      grecaptcha.reset();
      setTimeout(updateStatus(), 5000);
    });
  });

});
