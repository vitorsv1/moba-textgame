$(document).ready(()=>{
    let email,pass;
    $('#submit').click(function(){
        var password = $("#password").val();
        var confirmPassword = $("#password-conf").val();
        if (password != confirmPassword) {
            alert("Passwords do not match.");
            return false;
        }

        myEmail = $('#email').val();
        myPass = password;
        // Perform some validation here ...
        
        $.post("http://localhost:3000/register",
                {email:myEmail,pass:myPass},
                (data)=>{
                    if(data==='everythingOK'){
                        window.location.href="/";
                    }
        });

    });
});