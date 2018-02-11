
$(document).ready(function() {

  // Java playground scripts - java-play-1
  $('#buttonCreateProject').click(function() {

    $('#buttonCreateProject').addClass('disabled');
    $('#successCreateProject').addClass('hide-element');
    $('#outputCreateProject').text('Running in playground, one moment...');
    $('#outputCreateProject').css("text-decoration", "blink");

    $.ajax({
      type: "GET",
      url: "/playgound-api/java/createproject",
      dataType: "text"
    }).done (function (data) {

      $('#buttonCreateProject').removeClass('disabled');
      $('#successCreateProject').removeClass('hide-element');
      $('#outputCreateProject').css("text-decoration", "none");
      $('#outputCreateProject').text(data);

    });
  });

  // Java playground scripts - java-play-2
  $('#buttonRunApp').click(function() {

    $('#buttonRunApp').addClass('disabled');
    $('#successRunApp').addClass('hide-element');
    $('#outputRunApp').text('Running in playground, one moment...');
    $('#outputRunApp').css("text-decoration", "blink");

    $.ajax({
      type: "GET",
      url: "/playgound-api/java/runapp1",
      dataType: "text"
    }).done (function (data) {

      $('#buttonRunApp').removeClass('disabled');
      $('#successRunApp').removeClass('hide-element');
      $('#outputRunApp').css("text-decoration", "none");
      $('#outputRunApp').text(data);
    });
  });

  // Java playground scripts - java-play-3 - submit form
  $('#frmRunApp2').submit(function(e) {

    var frm = $('#frmRunApp2');
    e.preventDefault();

    $('#buttonRunApp2').addClass('disabled');
    $('#successRunApp').addClass('hide-element');
    $('#outputRunApp').text('Running in playground, one moment...');
    $('#outputRunApp').css("text-decoration", "blink");
  
    $.ajax({
      type: frm.attr('method'),
      url: frm.attr('action'),
      data: frm.serialize()
    }).done (function(data) {

      grecaptcha.reset();

      $('#buttonRunApp2').removeClass('disabled');
      $('#successRunApp').removeClass('hide-element');
      $('#outputRunApp').css("text-decoration", "none");
      $('#outputRunApp').text(data);
    });
  });

});
