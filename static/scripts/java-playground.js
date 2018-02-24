
$(document).ready(function() {

  // poll status endpoint and update 'textRunOutput' with status text
  function updateStatus() {
    var statusEndpoint = '/playgound-api/java/statustext';

    $.ajax({
      type: "GET",
      url: statusEndpoint,
      dataType: "text"
    }).done (function (data) {

      // Based on: https://schier.co/blog/2013/01/07/how-to-re-run-prismjs-on-ajax-content.html
      $('#textRunOutput').text(data);
      Prism.highlightElement($('#textRunOutput')[0]);
      $('#textRunOutput').scrollTop = $('#textRunOutput').scrollHeight;

      // clear status when command is "EXIT" or "ERROR"
      if ((data.indexOf("[EXIT]") >= 0) || (data.indexOf("[ERROR]") >= 0))
      {
        $('#buttonRun').removeClass('disabled');
        $('#textRunOutput').removeClass('hide-element');

        // show next step and 'congrats' message if there were no errors
        if (data.indexOf("[ERROR]") == -1)
        {
          $('#textSuccess').removeClass('hide-element');
          if($('#buttonNextStep').length > 0) {
            $('#buttonNextStep').removeClass('hide-element');
          }
        }

        // clear status text for current session
        $.ajax({
          type: "DELETE",
          url: statusEndpoint
        });
      }
      else
      {
        // poll endpoint every 1 second for status message
        setTimeout(updateStatus, 1000);
      }
    });
  }
  
  // submit form handler
  $('#formRunCommand').submit(function(e) {

    var form = $('#formRunCommand');
    e.preventDefault();
    e.stopPropagation();

    // Hide buttons until command completes. The buttons are subsequently shown by 'updateStatus'.
    $('#buttonRun').addClass('disabled');
    $('#textSuccess').addClass('hide-element');
    $('#textRunOutput').text('Running in playground, one moment...');

    if($('#buttonNextStep').length > 0) {
      $('#buttonNextStep').addClass('hide-element');
    }

    // Submit form
    $.ajax({
      type: form.attr('method'),
      url: form.attr('action'),
      data: form.serialize()
    }).done (function(data) {

      // Reset CAPTCHA if it's defined on this page
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
      }

      // Update status every 1 second
      setTimeout(updateStatus, 1000);
    });
  });

});
