<?php
$url = $_GET["url"];
?>


<!DOCTYPE html>
<html lang="ja">
<head>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport"
	content="width=device-width, initial-scale=1, shrink-to-fit=no">
<title>Canbadge</title>
<link rel="stylesheet" href="css/main.css">
<script src="https://code.jquery.com/jquery-3.1.1.slim.min.js"></script>
<script src="js/three.min.js"></script>
<script src="js/OrbitControls.js"></script>
<script src="js/MTLLoader.js"></script>
<script src="js/OBJLoader.js"></script>
<script src="js/main.js"></script>
<style>
#viewArea {
/* 	visibility: hidden; */
	width: 340px;
	height: 340px;
/* 	position: absolute; */
	top: 0px;
}
</style>
</head>
<body>
	<div class="container">
		<p align="left">缶バッチサンプル</p>
		<br>
<!-- 		<p align="left">さんの作品</p> -->
			<div id="viewArea"></div>
		</div>
		<p align="center">シェアしてね！</p>
	</div>
	<script src="js/3D_main.js"></script>
	<script type="text/javascript">
		$(function() {
			var status=1;
			var cropURI='<?php echo $url ?>';
			$('#viewArea').css({visibility:'visible'});
			$('body').css({background:'#2df'});
// 			$('.cropper-bg').css({visibility:'hidden'});
// 			$('.circle-guide').css({visibility:'hidden'});
// 			$('.fileupImg').css({visibility:'hidden'});
// 			$('#dropBtn').css({visibility:'hidden'});
// 			$('#mailBtn').css({display:'inline-block'});
// 			$('.filedownImg').html('やり直す');
			if(status==1){
				canbadge3Dinit(cropURI);
			} else {
				canbadgeLoader(cropURI);
				positionInit();
			}
		})
	</script>
</body>
</html>
