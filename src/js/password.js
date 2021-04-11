$(document).ready(function() {
    $("#show_hide_password_above a").on('click', function(event) {
        event.preventDefault();
        if($('#show_hide_password_above input').attr("type") == "text"){
            $('#show_hide_password_above input').attr('type', 'password');
            $('#show_hide_password_above i').addClass( "fa-eye-slash" );
            $('#show_hide_password_above i').removeClass( "fa-eye" );
        }else if($('#show_hide_password_above input').attr("type") == "password"){
            $('#show_hide_password_above input').attr('type', 'text');
            $('#show_hide_password_above i').removeClass( "fa-eye-slash" );
            $('#show_hide_password_above i').addClass( "fa-eye" );
        }
    });
    $("#show_hide_password_below a").on('click', function(event) {
        event.preventDefault();
        if($('#show_hide_password_below input').attr("type") == "text"){
            $('#show_hide_password_below input').attr('type', 'password');
            $('#show_hide_password_below i').addClass( "fa-eye-slash" );
            $('#show_hide_password_below i').removeClass( "fa-eye" );
        }else if($('#show_hide_password_below input').attr("type") == "password"){
            $('#show_hide_password_below input').attr('type', 'text');
            $('#show_hide_password_below i').removeClass( "fa-eye-slash" );
            $('#show_hide_password_below i').addClass( "fa-eye" );
        }
    });
});