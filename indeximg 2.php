<?php
//画像ファイル一覧を表示するパスを指定する
$path = "files";

//パスの表示
print("ディレクトリ「<b>".$path."</b>」の画像ファイル一覧");

//文法  scandir( パス ,[ ソート順 ] )
//scandir
//ソート順が省略された場合は、アルファベットの昇順にソートする
//ソート順に"1"が指定された場合は、アルファベットの降順にソートする
//
//昇順にソートする場合はソート順を省略する
//$array = scandir($path);

//降順にソートする場合はソート順に"1"を指定する
$array = scandir($path,1);

//count命令により配列の個数を取得する
$num = count($array);

//HTML文を出力　テーブルの開始を指定
print("<table border=1><tr>");

//横に並べる画像の最大数を設定する
$max = 1;

//カウント数の初期化
$cnt = 0;

//配列の数だけ繰り返す
for ($i=0;$i<$num;$i++){
	//$filenameにァイル名を設定
	$filename = "files/" . $array[$i];
	$link = "sample.php?url=files/" . $array[$i];

	//ファイル名の拡張子が｢gif｣または｢GIF｣または｢jpg｣または｢JPG｣
	//または｢JPEG｣または｢png｣または｢PNG｣の場合は実寸表示の
	//リンク付きで画像を表示する

	$file_info = pathinfo($filename);
	$img_extension = strtolower($file_info['extension']);

	if  (exif_imagetype($filename)){
				print("<td width=\"200\">" . $filename . "</td>");
				print("<td><a href=" .$link . "><img src = " .$filename. "></a></td>");


				//カウント数の初期化
				$cnt = $cnt + 1;

				//カウント数の判定 最大数以上の場合は改行し、カウントを初期化する
				if ($cnt >= $max) {
					print("</tr><tr>");
					$cnt = 0;
				}
			}
}
//HTML文を出力　テーブルの終了を指定
print("</tr></table>");

?>

<a href="myphp.php">メニュー</a>