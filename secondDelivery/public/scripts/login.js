$(document).ready(()=>{
    let email,pass;
    window.localStorage.setItem('username', '');
    $('#submit').click(function(){
        myEmail = $('#email').val();
        myPass = $('#password').val();
        console.log('post sends something');

        // Perform some validation here ...
        
        $.post("http://localhost:3000/login",
                {email:myEmail,pass:myPass},
                (data)=>{
                    //alert( data );
                    console.log('post recives something');
                    if(data==='EverythingOK'){
                        window.localStorage.setItem('username', myEmail);
                        window.location.replace('/');
                    }
        });

    });
});

function validateForm(){
    var email = $("#email").val();
    var pass = $("#password").val();

    if(email == null || email == "", pass == null || pass == ""){
        alert("The fields are empty!");
        return false;
    }

}
