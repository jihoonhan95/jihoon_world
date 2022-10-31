$("#allCk").change(function(){
    var isChk = $(this).is(":checked");
    $(".checkBox").prop("checked",isChk);
}); 