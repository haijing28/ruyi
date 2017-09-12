$(function() {
	$('.mySel').on('click', 'li', function() {
		var text = $(this).text();
		$('.mySel button').html(text + '<span class="glyphicon glyphicon-chevron-down myIcon"></span>');
	})
	$('.skill-img').click(function() {
		$('.hide_input_img_upload').click();
	})
	$('.hide_input_img_upload').change(function() {
		var reader = new FileReader();
		var img  = $('.hide_input_img_upload')[0].files[0];
		reader.onload = function(ret) {
			$('.skill-img').attr('src', ret.target.result);
		}
		reader.readAsDataURL(img);
	})
})