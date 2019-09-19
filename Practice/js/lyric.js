(function(window) {
	function Lyric(path) {
		return new Lyric.prototype.init(path);
	}
	Lyric.prototype = {
		constructor: Lyric,
		init:function(path){
			this.path = path;
		},
		times:[],
		lyrics:[],
	    index:-1,
		loadLyric:function(callBack){
			var $this = this;
			$.ajax({
				url:$this.path,
				dataType:"text",
				success:function(data){
					// console.log(data);
					$this.parseLyric(data);
					callBack();
				},
				//加载失败,函数返回参数
				error:function(e){
					console.log(e);
				}
			});
		},
		parseLyric:function(data){
			var $this = this;
			//清空上一首歌词信息
			$this.times=[];
			$this.lyrics=[];
			var array = data.split("\n");
			//console.log(array);
			//[00:00.05]
			var timeReg = /\[(\d*:\d*\.\d*)\]/;
			
			//遍历取出每一条歌词
			$.each(array,function(index,ele){
				//处理歌词
				var lrc = ele.split("]")[1];
				//排除空字符串(没有歌词的情况)
				if(lrc.length==1) return true;
				$this.lyrics.push(lrc);

				var res = timeReg.exec(ele);
				//console.log(res);
				if(res == null) return true;
				var timeStr = res[1];//00:00.05
				var res2 = timeStr.split(":");
				var min = parseInt(res2[0])*60;
				var sec = parseFloat(res2[1]);
				var time = parseFloat(Number(min+sec).toFixed(2));//保留两位小数
				$this.times.push(time);
			});
		},
		
		currentIndex:function(currentTime){
			 // console.log(currentTime);	
			if(currentTime>=(this.times[0]-0.55)){
				this.index++;
				this.times.shift();//删除数组最前面的一个元素
			}		
			return this.index;		
		}
		
		
		
		
	}
	Lyric.prototype.init.prototype = Lyric.prototype;
	window.Lyric = Lyric;
})(window);
