$(document).ready(()=>{
    console.log('hi');

    let email,pass;
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
                    window.location.href="/";
                    }
        });

    });
});

