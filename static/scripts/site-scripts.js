
// Set active link for the 'step' buttons on SDK pages
$(document).ready(function() {
    var pathname = window.location.pathname;
    $('#steps > a').removeClass('active');
    $('#steps > a[href="' + location.pathname + '"]').closest('a').addClass('active'); 
});

// Enable tooltips
$(document).ready(function() {
    $("body").tooltip({ selector: '[data-toggle=tooltip]' });
});