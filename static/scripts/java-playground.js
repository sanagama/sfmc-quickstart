
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

  // Java playground scripts - java-play-3
  $('#buttonRunApp2').click(function() {

    if($("#divEmail").valid())
    {
      $('#buttonRunApp2').addClass('disabled');
      $('#successRunApp').addClass('hide-element');
      $('#outputRunApp').text('Running in playground, one moment...');
      $('#outputRunApp').css("text-decoration", "blink");

      $.ajax({
        type: "GET",
        url: "/playgound-api/java/runapp2",
        dataType: "text"
      }).done (function (data) {
        $('#buttonRunApp2').removeClass('disabled');
        $('#successRunApp').removeClass('hide-element');
        $('#outputRunApp').css("text-decoration", "none");
        $('#outputRunApp').text(data);
      });
    }
    else
    {
      alert('enter valid e-mail address!')
    }
  });

  var javaCode = $('#areaJavaCode').text();

  //String sendToEmailAddress = "-- receipient's e-mail address --";

});



