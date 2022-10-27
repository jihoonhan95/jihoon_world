function checkz(){
    var getCheck= RegExp(/^[a-zA-Z0-9]{4,12}$/);
    var getName= RegExp(/^[가-힣]+$/);

    /*아이디 공백 확인*/
    if($("#id").val()==""){
        alert("아이디를 입력해주세요");
        $("#id").focus();
        return false;
    }

    /*비밀번호 공백 확인*/
    if($("#password").val() == ""){
        alert("비밀번호를 입력해주세요");
        $("#password").focus();
        return false;
        }

    if(!getCheck.test($("#password").val())) {
        alert("형식에 맞춰서 비밀번호를 입력해주세요 ");
        $("#password").val("");
        $("#password").focus();
        return false;
        }

    /*비밀번호 같은지*/
    if($("#password").val() != ($("#password_chk").val())){ 
        alert("비밀번호가 일치하지 않습니다.");
        $("#password").val("");
        $("#password_chk").val("");
        $("#password").focus();
        return false;
        }
    if($("#password_chk").val() == ""){
    alert("비밀번호 확인을 입력해주세요");
    $("#password_chk").focus();
    return false;
    }

    /*이름 공백 확인*/
    if($("#name").val() == ""){
    alert("이름을 입력해주세요");
    $("#name").focus();
    return false;
    }

    /*이름 제대로 썼는지 확인*/
    if (!getName.test($("#name").val())) {
        alert("이름을 바르게 써주세요");
        $("#name").val("");
        $("#name").focus();
        return false;
    }

    /*번호 공백 확인*/
    if($("#tel").val() == ""){
    alert("휴대폰 번호를 입력해주세요");
    $("#tel").focus();
    return false;
    }
    
    /*인증번호 공백 확인*/
    if($("#number").val() == ""){
    alert("인증번호를 입력해주세요");
    $("#number").focus();
    return false;
    }

    /*약관동의 체크 했는지*/
    if($("input:checkbox[id='essential1']").is(":checked") != true){
    alert('필수 약관동의에 체크해 주세요');
    return;
    }
    if($("input:checkbox[id='essential2']").is(":checked") != true){
    alert('필수 약관동의에 체크해 주세요');
    return;
    }
    if($("input:checkbox[id='essential3']").is(":checked") != true){
    alert('필수 약관동의에 체크해 주세요');
    return;
    }
    else{
        location.href="./new_2.html";
    }
}


$("#allChk").change(function(){
    var isChk = $(this).is(":checked");
    $(".checkbox").prop("checked",isChk);
    });