/* 일별구매정보 그래프 */
var context = document
    .getElementById('myChart')
    .getContext('2d');
var myChart = new Chart(context, {
    type: 'bar',
    data: { 
        labels: [
            '9/13','9/14','9/15','9/16','9/17'
        ],
        datasets: [
            { 
                label: '주문',
                data:[7,3,13,11,17],
                backgroundColor: [
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8'
                ],
            }
        ]
    },
    options: {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    }
});


/* 접속자 */
var context = document
    .getElementById('accessor')
    .getContext('2d');
var accessor = new Chart(context, {
    type: 'bar',
    data: {
        labels: [
            '메인','상품목록','상품상세','주문작성','결제완료','장바구니'
            ],
        datasets: [
            {
                label: 'MOBILE',
                data: [4,4,8,8,4,2],
                backgroundColor: [
                    '#EFB750',
                    '#EFB750',
                    '#EFB750',
                    '#EFB750',
                    '#EFB750',
                    '#EFB750'
                ],
            },
            {
                label: 'PC',
                fill: false,
                data: [6,10,10,8,8,4],
                backgroundColor: [
                    '#559ADF',
                    '#559ADF',
                    '#559ADF',
                    '#559ADF',
                    '#559ADF',
                    '#559ADF'
                ],
            },
            { 
                label: '전체',
                fill: false,
                data: [8,14,18,16,12,6],
                backgroundColor: [
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8'
                ],
            }
        ]
    },
    options: {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    }
});


























/* 고객센터 접수 정보 */
var context = document
    .getElementById('CenterChart')
    .getContext('2d');
var CenterChart = new Chart(context, {
    type: 'bar', // 차트의 형태
    data: { // 차트에 들어갈 데이터
        labels: [
            //x 축
            '9/13','914','9/15','9/16'
        ],
        datasets: [
            { //데이터
                label: '고객센터 접수 정보', //차트 제목
                fill: false, // line 형태일 때, 선 안쪽을 채우는지 안채우는지
                data: [
                    3,1,7,9//x축 label에 대응되는 데이터 값
                ],
                backgroundColor: [
                    //색상
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8',
                    '#9EB4A8'
                ],
            }
        ]
    },
    options: {
        scales: {
            yAxes: [
                {
                    ticks: {
                        beginAtZero: true
                    }
                }
            ]
        }
    }
});