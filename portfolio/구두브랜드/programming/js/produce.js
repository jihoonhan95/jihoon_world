$(document).ready(function(){
    //파일첨부 이벤트
    $('.filebox .upload-hidden').on('change', function(){  			
        if(window.FileReader){
            var filename = $(this)[0].files[0].name;
            if(!validFileType(filename)){
                alert("허용하지 않는 확장자 파일입니다.");
                return false;
            }else{
                if(!validFileSize($(this)[0].files[0])){
                    alert("파일 사이즈가 10MB를 초과합니다.");
                    return false;
                }else{
                    if(!validFileNameSize(filename)){
                        alert("파일명이 30자를 초과합니다.");
                        return false;
                    }
                }
            }
        } else {
            var filename = $(this).val().split('/').pop().split('\\').pop();
        }
        $(this).prev().val(filename); //input upload-name 에 파일명 설정해주기

        readImage($(this)[0]); //미리보기
    });
});

function validFileType(filename) {
    const fileTypes = ["png", "jpg", "jpeg"];
    return fileTypes.indexOf(filename.substring(filename.lastIndexOf(".")+1, filename.length).toLowerCase()) >= 0;
}

function validFileSize(file){
    if(file.size > 10000000){ //10MB
        return false;
    }else{
        return true;
    }
}

function validFileNameSize(filename){
    if(filename.length > 30){ //30자
        return false;
    }else{
        return true;
    }
}

//이미지 띄우기
function readImage(input) {
    if(input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e){
            const previewImage = document.getElementById("previewImg");
            previewImage.src = e.target.result;
        }
        // reader가 이미지 읽도록 하기
        reader.readAsDataURL(input.files[0]);
    }
}

//이미지 원본 팝업 띄우기
function popImage(url) {
    var img = new Image();
    img.src = url;
    var img_width = img.width;
    var win_width = img.width + 25;
    var img_height = img.height;
    var win = img.height + 30;
    var popup = window.open('', '_blank', 'width=' + img_width + ', height=' + img_height + ', menubars=no, scrollbars=auto');
    popup.document.write("<style>body{margin:0px;}</style><img src='"+url+"' width='"+win_width+"'>");
}


$('#pop').click(function() {
    $("#pop_up").show();
});
$('#cancellation').click(function() {
    $("#pop_up").hide();
});