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

        $.post("/register",
                {email:myEmail,pass:myPass},
                (data)=>{
                    if(data === 'everythingOK'){
                        localStorage.setItem('username', myEmail);
                        window.location.replace("/");
                    }
                    else alert("not a vailid user");
        });

    });
});

function validateForm(){
    var email = $("#email").val();
    var pass = $("#password").val();
    var pass2 = $("#password-conf").val();

    if(email == null || email == "", pass == null || pass == "", pass2 == null || pass2 == ""){
        alert("Please Fill All Fields!!");
        return false;
    }

}