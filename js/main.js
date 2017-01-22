$(function() {

	// 初期設定
	fileUpload();


});
$('#cropBtn').on('click', function () {
    var cropImg = $('#image').cropper('getCroppedCanvas', {
        width: 200,
        height: 200,
    });
    var cropURI = cropImg.toDataURL("image/jpeg");
    $('#cropBtn a').attr('href',cropURI);
//    $('#cropImg').attr('src',cropURI);
    $('#cropImg').html(cropImg);
});


function fileUpload() {



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
			// $img.attr('src', event.target.result);
			$img.cropper('replace', event.target.result);
			// $downfile.attr('href',
			// $img.cropper('getCroppedCanvas').toDataURL('image/png'));
			var cropImg = $img.cropper('getCroppedCanvas')
					.toDataURL();
//			$img_canvas.attr('src', cropImg);
			//
			 $downfile.attr('href', cropImg);
			// console.log( event.target.toDataURL('image/jpeg'));
		};
		fileReader.readAsDataURL(file);
	}
}
