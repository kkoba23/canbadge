$(function() {
	var status = 1;
	var threejs_loaded = false;
	var cropURI;
	var nickname;
	// ドラッグ＆ドロップの実装
	$('.dragArea').on('drop', function(e) {
		e.preventDefault();
		$('.dragArea').removeClass('over');
		$('.dragArea').addClass('dropped');
		$('#dropBtn').css({
			display : 'inline-block'
		})
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

	function uploadPHPfile() {
		var fd = new FormData(document.querySelector("form"));
		fd.append("CustomField", "This is some extra data");

		$.ajax({
			url : "upload.php",
			type : "POST",
			data : fd,
			cache : false,
			contentType : false,
			processData : false
		}).done(function(data, textStatus, jqXHR) {
			alert(data);
		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert("fail");
		});
	}

	// メールで注文する
//	$("#mailLink").on("click", function() {
//		$('.nickname').css({//			display: 'inline-block',
//			visibility : 'visible'
//		});
//		$('#mailLink').css({
//			visibility : 'hidden'
//		});
//		$('.undo').css({
//			visibility : 'hidden'
//		});
//		$('#viewArea').css({
//			visibility : 'hidden'
//		});
//		$('body').css({
//			background : '#5aa'
//		});
//	});

	$('#mailLink').on('click', function(){
		var sample_url;
		console.log($('.nickname_text').value);
		alert('保存しました！');
		canvas = cropURI;
		$.ajax({
			type : 'POST',
			url : 'image-accept.php',
			data : {
				acceptImage : canvas,
				nickname : $('.nickname_text').value
			},
			success : function(data, dataType) {
				sample_url = 'sample.php?url=files/' + data;
				// console.log(sample_url);
				window.location.href = sample_url;
			},
			error : function(XMLHttpRequest, textStatus, errorThrown) {
			}
		});
	});
	// ドラッグエリアの表示/非表示
	$(".fileupImg").on('mouseover', function() {
		$('.dragArea').css({
			display : 'none'
		});
	}).on('mouseleave', function() {
		$('.dragArea').css({
			display : 'inline-block'
		});
	});

	// 決定ボタン
	$('.filedownImg').on('click', function() {

		var cropImg = $('#image').cropper('getCroppedCanvas', {
			width : 700,
			height : 700,
		});
		$('.hyoji').attr('src', cropImg.toDataURL());
		$('#viewArea').css({
			visibility : 'visible'
		});
		$('body').css({
			background : '#2df'
		});
		$('.cropper-bg').css({
			visibility : 'hidden'
		});
		$('.circle-guide').css({
			visibility : 'hidden'
		});
		$('.fileupImg').css({
			visibility : 'hidden'
		});
		$('#dropBtn').css({
			visibility : 'hidden'
		});
		$('.filedownImg').css({
			visibility : 'hidden'
		});
		$('#mailLink').css({
			visibility : 'visible'
		});
		// $('.undo').css({
		// visibility : 'visible'
		// });
		$('.undo').html('やり直す');
		// $('.filedownImg').html('やり直す');
		cropURI = cropImg.toDataURL("image/jpeg");
		console.log(status);
		if (threejs_loaded == false) {
			canbadge3Dinit(cropURI);
			threejs_loaded = true;
		} else {
			canbadgeLoader(cropURI);
			positionInit();
		};
		status = 3;
		// $('#cropBtn a').attr('href', cropURI);
	});

	$('.undo').on('click', function() {
		if (status == 3) {
			$('body').css({
				background : '#0af'
			});
			// $('#dropBtn').css({
			// visibility : 'visible'
			// });
			// $('.fileupImg').css({
			// visibility : 'visible'
			// });
			$('.cropper-bg').css({
				visibility : 'visible'
			});
			$('.circle-guide').css({
				visibility : 'visible'
			});
			$('#mailLink').css({
				visibility : 'hidden'
			});
			$('#viewArea').css({
				visibility : 'hidden'
			});
			$('.filedownImg').css({
				visibility : 'visible'
			});
			$('.undo').html('画像を選び直す');
			$('.filedownImg').css({
				left : '-10px'
			});
			status = 2;
		} else {
			location.reload();
		}
	});

	// アップロードボタンを押した時の処理
	$('input[name=img]').change(function() {
		if (!this.files.length) {
			return;
		}
		var file = this.files[0];
		upload(file);
		$('.fileupImg').css({
			visibility : 'hidden'
		});
		$('.filedownImg').css({
			visibility : 'visible'
		});
		$('.undo').css({
			visibility : 'visible'
		});
		status = 2;
	});

	// HTMLに表示
	function upload(file) {
		var $img = $(".thumb");
		fileReader = new FileReader();
		fileReader.onload = function(event) {
			$img.cropper('replace', event.target.result);
		};
		fileReader.readAsDataURL(file);
	}
});
