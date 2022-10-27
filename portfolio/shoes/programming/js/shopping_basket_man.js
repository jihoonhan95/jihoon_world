let item1 = {
    name : '남자 캐주얼 로퍼',
    price : 150000
};
let item2 = {
    name : '브라운 캐쥬얼 신사화',
    price : 150000
};
let item3 = {
    name : '전통 오스터드 남자 구두',
    price : 146000
};
let item4 = {
    name : '소가죽 윙팁 남자 구두',
    price : 156000
};
let items = [0, item1.price, item2.price, item3.price, item4.price];


//초기화
$(document).ready(function(){
    $(".buckets:nth-of-type(1) .item_name").html(item1.name);
    $(".buckets:nth-of-type(1) .item_price").html(item1.price.toLocaleString()+"원");


    $(".buckets:nth-of-type(2) .item_name").html(item2.name);
    $(".buckets:nth-of-type(2) .item_price").html(item2.price.toLocaleString()+"원");


    $(".buckets:nth-of-type(3) .item_name").html(item3.name);
    $(".buckets:nth-of-type(3) .item_price").html(item3.price.toLocaleString()+"원");


    $(".buckets:nth-of-type(4) .item_name").html(item4.name);
    $(".buckets:nth-of-type(4) .item_price").html(item4.price.toLocaleString()+"원");


        
    list_delete();  //리스트삭제
    bucketslist();  //건수 구하기
    list_refresh(); // 건수 새로고침
    //총금액계산
    let sum = 0;
    for(let i = 0; i < bucketslist(); i++){
        let sprs = parseInt($(".buckets:nth-of-type("+(i+1)+") .count_items").text());
        sum = sum + (sprs * items[i+1]);
    };
    paybanner(sum);    //구매하기배너
});

//총 건수
let bucketslist = function(){   //건수 구하기
    return $(".buckets").length;
};
let list_refresh = function(){  //새로고침
    $("#counting_buckets>h3").html("총 "+bucketslist()+"건");
};



// 가격계산
$(function(){
    //감소버튼
    $(".btn_dec").click(function(){
        if(parseInt($(this).siblings(".count_items").text()) >= 2){  //2 이상, 200이하 일때만 감소
            let nowcnt = parseInt($(this).siblings(".count_items").text());
            let aftercnt = nowcnt - 1;
            $(this).siblings(".count_items").html(aftercnt);
            let idx = $(this).parents("ul").index() + 1;

            let afterprice = price(aftercnt, idx);  //계산함수 호출
            let min_com = afterprice.toLocaleString();
            
            $(this).parent("div").siblings(".item_price").html(min_com+"원")
        }

        //총금액계산
        let sum = 0;
        for(let i = 0; i < bucketslist(); i++){
            let sprs = parseInt($(".buckets:nth-of-type("+(i+1)+") .count_items").text());
            sum = sum + (sprs * items[i+1]);
        };
        paybanner(sum);
    });

    //증가버튼
    $(".btn_inc").click(function(){
        if(($(this).siblings(".count_items").text()) < 200){
        let nowcnt = parseInt($(this).siblings(".count_items").text());
        let aftercnt = nowcnt + 1;
        $(this).siblings(".count_items").html(aftercnt);
        let idx = $(this).parents("ul").index() + 1;

        let afterprice = price(aftercnt, idx);  //계산함수 호출
        let pls_com = afterprice.toLocaleString();
        $(this).parent("div").siblings(".item_price").html(pls_com+"원");
        }

        //총금액계산
        let sum = 0;
        for(let i = 0; i < bucketslist(); i++){
            let sprs = parseInt($(".buckets:nth-of-type("+(i+1)+") .count_items").text());
            sum = sum + (sprs * items[i+1]);
        };
        paybanner(sum);
    });
});
//가격계산식
function price(aftercnt, idx){
        return items[idx] * aftercnt;
    }; 


//결제 링크 배너 최신화
let paybanner = function(sum){
    $("#to_pay_link h5:first-child").html(bucketslist()+"개 상품 "+sum.toLocaleString()+"원 + 배송비 3,000원 입니다.");
    $("#to_pay_link h4:last-child").html("총 "+(sum+3000).toLocaleString()+"원");
};


//체크박스 이벤트
function checkSelectAll()  {
    // 전체 체크박스
    const checkboxes 
      = document.querySelectorAll('input[name="items"]');
    // 선택된 체크박스
    const checked 
      = document.querySelectorAll('input[name="items"]:checked');
    // select all 체크박스
    const selectAll 
      = document.querySelector('input[name="selectall"]');
    
    if(checkboxes.length === checked.length)  {
      selectAll.checked = true;
    }else {
      selectAll.checked = false;
    }
  }
  
  function selectAll(selectAll)  {
    const checkboxes 
       = document.getElementsByName('items');
    
    checkboxes.forEach((checkbox) => {
      checkbox.checked = selectAll.checked
    })
  }


//삭제이벤트
//X버튼
let list_delete = function(){
    $("button.delete").click(function(){
        $(this).parents(".buckets").remove();
        
        //총금액계산
        let sum = 0;
        for(let i = 0; i < bucketslist(); i++){
            let sprs = parseInt($(".buckets:nth-of-type("+(i+1)+") .count_items").text());
            sum = sum + (sprs * items[i+1]);
        };

        bucketslist();
        list_refresh();
        paybanner(sum);
    });
};

//선택삭제
$("button[name=delete_select_items]").click(function(){
    let for_idx = bucketslist();
    let bkt_chk = [];
    for(let i = 1; i <= for_idx; i++){
        bkt_chk[i] = $(".buckets:nth-of-type("+i+")").find("input[name=items]").is(":checked");

        if(bkt_chk[i] == true){
            $(".buckets:nth-of-type("+i+")").addClass("rmv");
        }
    }
    $(".rmv").remove();
    
    bucketslist();
    list_refresh();
    //총금액계산
    let sum = 0;
    for(let i = 0; i < bucketslist(); i++){
        let sprs = parseInt($(".buckets:nth-of-type("+(i+1)+") .count_items").text());
        sum = sum + (sprs * items[i+1]);
    };
    paybanner(sum);

});