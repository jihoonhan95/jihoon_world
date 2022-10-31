$(function(){
	$.datepicker.setDefaults($.datepicker.regional['ko']);
	$(".seldate").datepicker({
		firstDay:1,
		dayNamesMin : ["일","월","화","수","목","금","토"]
	});
});


