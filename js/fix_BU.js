$(function(){

	//初期設定
	fileUpload();
	return;
	//ページを表示させる箇所の設定
	var $content = $('.pageDisplay');
	//ボタンをクリックした時の処理
	$(document).on('click', '.gnavi a', function(event) {
		event.preventDefault();
		//.gnavi aのhrefにあるリンク先を保存
		var link = $(this).attr("href");
		//リンク先が今と同じであれば遷移しない
		if(link == lastpage){
			return false;
		}else{
			$content.fadeOut(600, function() {
				getPage(link);
			});
			//今のリンク先を保存
			lastpage = link;
		}

	});
});

function fileUpload(){

	  $(".fileupImg").on("click", function(event){
	     $("input[name=img]").trigger("click");
	  });
	  $('input[name=img]').change(function(){

	      if (!this.files.length) {
	          return;
	      }
	      var file = this.files[0];
	      upload(file);

	  });

	  //ドラッグ＆ドロップの実装
	  $('.dragArea').on('drop', function(e){
	    e.preventDefault();
	 	$('.dragArea').removeClass('over');
	    // ファイル情報を取得
	    var files = e.originalEvent.dataTransfer.files;
	 	upload(files[0]);

	  }).on('dragenter', function(){
	    $('.dragArea').addClass('over');
	    return false;
	  }).on('dragover', function(){
	    $('.dragArea').addClass('over');
	    return false;
	  }).on('dragleave', function(){
	    $('.dragArea').removeClass('over');
	    return false;
	  });

	  //HTMLに表示
	  function upload(file){
	  	var fileInfo = "ファイル名： " + file.name +
	      "<br>ファイルサイズ： " + file.size +
	      "<br>最終更新日時：" + file.lastModifiedDate;

	      $(".fileInfo").html(fileInfo);
	      var $img = $(".thumb"),
	          fileReader = new FileReader();

	      fileReader.onload = function(event) {
	          $img.attr('src', event.target.result);

	      };
	      fileReader.readAsDataURL(file);
	  }
}
