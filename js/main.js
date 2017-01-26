$(function() {
	var status=1;
	var cropURI;
	// ドラッグ＆ドロップの実装
	$('.dragArea').on('drop', function(e) {
		e.preventDefault();
		$('.dragArea').removeClass('over');
		$('.dragArea').addClass('dropped');
		$('#dropBtn').css({display:'inline-block'})
		$('.dragArea').html('');
		// $('.dragArea').toggle();
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

	$('#dropBtn').on('drop', function(e) {
		e.preventDefault();
		$('#dropBtn').removeClass('over');
		$('#dropBtn').addClass('dropped');
		var files = e.originalEvent.dataTransfer.files;
		upload(files[0]);
	}).on('dragenter', function() {
		$('#dropBtn').addClass('over');
		return false;
	}).on('dragover', function() {
		$('#dropBtn').addClass('over');
		return false;
	}).on('dragleave', function() {
		$('#dropBtn').removeClass('over');
		return false;
	});

	// 画像をアップロードボタン
	$(".fileupImg").on("click", function(event) {
		$("input[name=img]").trigger("click");
	});
	// メールで注文する
	$("#mailBtn").on("click", function(event) {
		$('#mailLink').attr('href', cropURI);
//		console.log($('#mailBtn a'));
//		$('#mailBtn a').trigger("click");
	});
	// ドラッグエリアの表示/非表示
	$(".fileupImg").on('mouseover', function() {
		$('.dragArea').css({ display:'none'});
	}).on('mouseleave', function(){
		$('.dragArea').css({ display:'inline-block'});
	});

	// 決定ボタン
	$('.filedownImg').on('click', function() {
		if(status>0){
			var cropImg = $('#image').cropper('getCroppedCanvas', {
				width : 700,
				height : 700,
			});
			$('.hyoji').attr('src', cropImg.toDataURL());
			$('#viewArea').css({visibility:'visible'});
			$('body').css({background:'#2df'});
			$('.cropper-bg').css({visibility:'hidden'});
			$('.circle-guide').css({visibility:'hidden'});
			$('.fileupImg').css({visibility:'hidden'});
			$('#dropBtn').css({visibility:'hidden'});
			$('#mailBtn').css({display:'inline-block'});
			$('.filedownImg').html('やり直す');
			cropURI = cropImg.toDataURL("image/jpeg");
			if(status==1){
				canbadge3Dinit(cropURI);
			} else {
				canbadgeLoader(cropURI);
				positionInit();
			}
			status=0;
//			$('#cropBtn a').attr('href', cropURI);
		} else {
			$('body').css({background:'#0af'});
			$('#dropBtn').css({visibility:'visible'});
			$('.fileupImg').css({visibility:'visible'});
			$('.cropper-bg').css({visibility:'visible'});
			$('.circle-guide').css({visibility:'visible'});
			$('#mailBtn').css({display:'none'});
			$('#viewArea').css({visibility:'hidden'});
			$('.filedownImg').html('決定');
			status=2;
		}
	});

	// アップロードボタンを押した時の処理
	$('input[name=img]').change(function() {
		if (!this.files.length) {
			return;
		}
		var file = this.files[0];
		upload(file);
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
});
