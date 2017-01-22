$(function() {

	// 初期設定
	fileUpload();


});
//$('#cropBtn').on('click', function () {
//    var cropImg = $('#image').cropper('getCroppedCanvas', {
//        width: 350,
//        height: 350,
//    });
//    var cropURI = cropImg.toDataURL("image/jpeg");
//    $('#cropBtn a').attr('href',cropURI);
////    $('#cropImg').attr('src',cropURI);
//    $('#cropImg').html(cropImg);
//});


function fileUpload() {

	$('.filedownImg').on('click', function () {
	    var cropImg = $('#image').cropper('getCroppedCanvas', {
	        width: 700,height: 700,
	    });
	    var cropURI = cropImg.toDataURL("image/jpeg");
	    $('#cropBtn a').attr('href',cropURI);
	});


	$(".fileupImg").on("click", function(event) {
		$("input[name=img]").trigger("click");
	});
	$('input[name=img]').change(function() {

		if (!this.files.length) {
			return;
		}
		var file = this.files[0];
		upload(file);

	});
	// ドラッグ＆ドロップの実装
	$('.dragArea').on('drop', function(e) {
		e.preventDefault();
		$('.dragArea').removeClass('over');
		// ファイル情報を取得
		var files = e.originalEvent.dataTransfer.files;
		upload(files[0]);

	}).on('dragenter', function() {
		$('.dragArea').addClass('over');
		return false;
	}).on('dragover', function() {
		$('.dragArea').addClass('over');
		return false;
	}).on('dragleave', function() {
		$('.dragArea').removeClass('over');
		return false;
	});

	// HTMLに表示
	function upload(file) {
		var $img = $(".thumb"), $downfile = $(".filedownImg")
		fileReader = new FileReader();
		fileReader.onload = function(event) {
			$img.cropper('replace', event.target.result);
		};
		fileReader.readAsDataURL(file);
	}
}
