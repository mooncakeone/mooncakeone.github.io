$(function() {

	//自定义滚动条
	$(".content_list").mCustomScrollbar();

	//拿到播放控制
	var $audio = $("audio");
	var player = new Player($audio);
	var progress;
	var voiceProgress;
	var lyric;
	
	//加载歌曲列表
	getPlayerList();

	function getPlayerList() {
		//加载的参数：对象的形式
		$.ajax({
			//地址：
			url: "../source/musics.json",
			//文件类型
			dataType: "json",
			//加载成功，函数返回参数,(比如这里是json就返回一个对象数组，包含每一条歌曲的信息)
			success: function(data) {
				//将传输的数据存放在player对象的musicList数组中
				player.musicList = data;
				//遍历获取到的数据，创建每一条音乐
				$.each(data, function(index, ele) {
					//index是索引值(第几个),ele是对应的对象，可以用ele.属性调用对应的属性或者方法

					//用新的方法创建一条音乐
					var $li = createMusicItem(index, ele);
					$(".content-ul").append($li);
				});

				//加载完毕后再初始化音乐(背景，歌词，进度条等等)
				initMusicInfor(data[0]);
				initMusicLyric(data[0]);
			},
			//加载失败,函数返回参数
			error: function(e) {
				console.log(e);
			}
		});
	}

	//初始化歌曲信息
	function initMusicInfor(music) {
		//找到歌曲所有相关信息(右侧)
		var $musicImage = $(".song-info-pie>img");
		var $musicName = $(".song-info-name>a");
		var $musicSinger = $(".song-info-singer>a");
		var $musicAlbum = $(".song-info-album>a");

		//进度条部分
		var $musicProName = $(".music-progress-name");
		var $musicProTime = $(".music-progress-time");

		//背景部分
		var $musicBg = $(".mask-bg");


		//给对应信息赋值
		$musicImage.attr("src", music.cover);
		$musicName.text(music.name);
		$musicSinger.text(music.singer);
		$musicAlbum.text(music.album);
		$musicProName.text(music.name + " / " + music.singer);
		$musicProTime.text("00:00" + " / " + music.time);
		$musicBg.css("background", "url('" + music.cover + "')");
	}

	//初始化歌词信息
	function initMusicLyric(music) {
		 lyric = new Lyric(music.link_lyric);
		//拿到歌词列表的容器
		var $lyricContainer = $(".song_content");
		$lyricContainer.html("");
		lyric.loadLyric(function() {
			$.each(lyric.lyrics, function(index, ele) {
				//创建歌词列表
				var $item = $("<li>" + ele + "</li>");
				$lyricContainer.append($item);

			})

		});
		
	}


	initProgress();
	//初始化进度条
	function initProgress() {
		//获取进度条
		var $progressBottom = $(".music-progress-infor-bottom");
		var $progressLine = $(".music-progress-bottom-line");
		var $progressDot = $(".music-progress-bottom-dot");
		/*播放进度条*/
		progress = new Progress($progressBottom, $progressLine, $progressDot);
		//点击设置位置
		progress.progressClick(function(value) {
			player.musicSeekTo(value);

		});
		//拖动设置位置
		progress.progressMove(function(value){
			player.musicSeekTo(value);
			
		});

		/*音量进度条*/
		var $voicBottom = $(".music-voice-bottom");
		var $voiceLine = $(".music-voice-bottom-line");
		var $voiceDot = $(".music-voice-line-dot");

		voiceProgress = new Progress($voicBottom, $voiceLine, $voiceDot);
		voiceProgress.progressClick(function(value) {
			player.musicVoiceSeekTo(value);
		});
		voiceProgress.progressMove(function(value){
			player.musicVoiceSeekTo(value);
		});
	}

	//初始化事件监听
	eventsInit();

	function eventsInit() {
		//监听歌曲的移入移出事件
		//动态创建的元素用事件委托来绑定事件
		$(".content_list").delegate(".list_music", "mouseenter", function() {
			//移入显示隐藏图标
			$(this).find(".list_menu").stop().fadeIn(100);
			$(this).find(".list_time>a").stop().fadeIn(100);
			//时间隐藏
			$(this).find(".list_time>span").stop().fadeOut(100);
		});
		$(".content_list").delegate(".list_music", "mouseleave", function() {
			//移出取消显示隐藏图标
			$(this).find(".list_menu").stop().fadeOut(100);
			$(this).find(".list_time>a").stop().fadeOut(100);
			//时间显示
			$(this).find(".list_time>span").stop().fadeIn(100);
		});
		//找到底部音乐播放按钮
		var $musicPlay = $(".music-play");


		//委托监听复选框点击事件
		$(".content_list").delegate(".list_check", "click", function() {
			//添加类复选框
			$(this).toggleClass("list_checked");
		});

		//添加子菜单播放按钮的监听
		$(".content_list").delegate(".list_menu_play", "click", function() {
			//$item代表这一整条歌曲，即一条li
			var $item = $(this).parents(".list_music");

			//console.log($item.get(0).index);
			//console.log($item.get(0).music);

			//切换播放图标
			$(this).toggleClass("list_menu_play2");
			//复原其他播放图标
			//找到这个播放按钮所在的这条音乐的其他兄弟的播放按钮,并且关闭播放
			$item.siblings().find(".list_menu_play").removeClass("list_menu_play2");

			//同时切换底部音乐按钮与上面的按钮同步
			//如果当前按钮的class属性值是list_menu_play2，则执行
			if ($(this).attr("class").indexOf("list_menu_play2") != -1) {
				//当前是播放状态
				$musicPlay.addClass("music-play2");
				//让文字高亮
				$item.find("div").css("color", "#fff");
				////让其他文字不高亮
				$item.siblings().find("div").css("color", "rgba(255,255,255,0.5)");
			} else {
				//当前不是播放状态
				$musicPlay.removeClass("music-play2");
				//让文字不高亮
				$item.find("div").css("color", "rgba(255,255,255,0.5)");
			}

			//序号变gif
			$item.find(".list_number").toggleClass("list_number2");
			//其他序号不变gif
			$item.siblings().find(".list_number").removeClass("list_number2");

			//播放音乐
			player.playMusic($item.get(0).index, $item.get(0).music);
			//切换歌曲信息
			initMusicInfor($item.get(0).music);
			//切换歌词信息
			initMusicLyric($item.get(0).music);
		});


		//监听底部控制区域播放按钮的点击
		$musicPlay.click(function() {
			//判断有没有播放过音乐
			if (player.currentIndex == -1) {
				//没有播放过，就直接播放第一首音乐，即点击第一首播放按钮
				$(".list_music").eq(0).find(".list_menu_play").trigger("click");
			} else {
				//播放过，拿到当前播放过的索引，然后再次点击，即暂停播放
				$(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
			}
		});

		//监听底部控制区域上一首按钮的点击，就是player.currentIndex-1
		$(".music-pre").click(function() {
			$(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");
		});

		//监听底部控制区域下一首按钮的点击，就是player.currentIndex+1
		$(".music-next").click(function() {
			$(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");
		});

		//监听删除按钮的点击，通过事件委托来监听
		$(".content_list").delegate(".list_menu_del", "click", function() {
			//找到这条删除按钮对应的那条音乐li
			var $item = $(this).parents(".list_music");
			//判断当前删除的这条是否正在播放
			if ($item.get(0).index == player.currentIndex) {
				//如果是，就播放下一首(触发下一首的按钮点击事件)
				$(".music-next").trigger("click");
			}
			//删除这条音乐
			$item.remove();
			//除了从界面删掉，还要删除后台数据
			player.changeMusic($item.get(0).index);

			//重新排序
			$(".list_music").each(function(index, ele) {
				//将对象(就是这段音乐)的对应的索引改为当遍历得到的实时索引
				ele.index = index;
				//这段音乐中的对应number值也需要对应起来
				$(ele).find(".list_number").text(index + 1);
			});

		});

		//监听播放的进度
		player.musicTimeUpdate(function(currentTime, duration, timeStr) {
			//同步时间
			$(".music-progress-time").text(timeStr);
			//同步进度条
			//计算播放比例
			var values = (currentTime / duration) * 100;
			progress.setProgress(values);
			//实现歌词同步
			var index = lyric.currentIndex(currentTime);
			var $item = $(".song_content li").eq(index);
			$item.addClass("cur");
			$item.siblings().removeClass("cur");
			
			if(index<=2) return;
			
			$(".song_content").css({
				marginTop:(-index+2)*30
				
			})
			
			
		});

		//监听声音按钮的点击
		$(".music-voice").click(function() {
			//图标的切换
			$(this).toggleClass("music-voice1");
			//声音的切换,判断有没有这个类
			if ($(this).attr("class").indexOf("music-voice1") != -1) {
				//变为没有声音
				player.musicVoiceSeekTo(0);
			} else {
				//变为有声音
				player.musicVoiceSeekTo(1);
			}
		});


	}

	//定义一个方法创建一条音乐
	function createMusicItem(index, ele) {
		//创建一个li节点：(内部有双引号的用单引号，不要换行，其他不变)
		var $li = $("<li class='list_music'><div class='list_check'><i></i></div><div class='list_number'>" + (index + 1) +
			"</div><div class='list_name'>" + ele.name +
			"<div class='list_menu'><a href='javascript:;' title='播放' class='list_menu_play'></a><a href='javascript:;' title='添加'></a><a href='javascript:;' title='下载'></a><a href='javascript:;' title='分享'></a></div></div><div class='list_singer'>" +
			ele.singer + "</div><div class='list_time'><span>" + ele.time +
			"</span><a href='javascript:;' title='删除' class='list_menu_del'></a></div></li>");


		//获取这条音乐的索引	 
		$li.get(0).index = index;
		//获取这条音乐的内容(对象)
		$li.get(0).music = ele;
		return $li;
	}


})
