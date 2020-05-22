$(document).ready(()=>{
    let email,pass;
    $('#submit').click(function(){
        myEmail = $('#email').val();
        myPass = $('#password').val();
        // Perform some validation here ...
        
        $.post("http://localhost:3000/login",
                {email:myEmail,pass:myPass},
                (data)=>{
                    //alert( data );
                    if(data==='everythingOK'){
                        window.location.href="/admin";
                    }
        });

    });
});