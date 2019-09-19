(function(window) {
	//创建一个Progress函数
	function Progress($Bottom, $Line, $Dot) {

		return new Progress.prototype.init($Bottom, $Line, $Dot);

	}
	Progress.prototype = {
		constructor: Progress,
		isMove: false,
		init: function($Bottom, $Line, $Dot) {
			this.$Bottom = $Bottom;
			this.$Line = $Line;
			this.$Dot = $Dot;
		},
		progressClick: function(callBack) {
			
			//播放进度条  或者   音量进度条
			var $this = this; //此时此刻this是progress,谁调用就是谁的
			//监听背景的点击
			this.$Bottom.click(function(event) {
				//获取背景距离窗口的位置
				var normalLeft = $(this).offset().left;

				//获取点击的位置距离窗口的位置
				var eventLeft = event.pageX;

				/*这里的this是$Bottom，谁调用就是谁的*/
				//设置前景的宽度$Line
				$this.$Line.css("width", eventLeft - normalLeft);

				//设置圆点的位置dot
				$this.$Dot.css("left", eventLeft - normalLeft);
				

				//计算进度条比例位置()
				var value = (eventLeft - normalLeft) / $(this).width();
				callBack(value);
			});
		},
		
		progressMove: function(callBack) {
			//获取背景距离窗口的位置
			var normalLeft = this.$Bottom.offset().left;
			var $this = this;
			var eventLeft;
			var bottomWidth = this.$Bottom.width();
			//监听鼠标的按下事件
			this.$Bottom.mousedown(function() {
				$(document).mousemove(function(event) {
				//监听鼠标的移动事件
				$this.isMove = true;				
					//获取点击的位置距离窗口的位置
					eventLeft = event.pageX;
					var offset = eventLeft - normalLeft;
					if (offset >= 0 && offset <= bottomWidth) {
						
						/*这里的this是$Bottom，谁调用就是谁的*/
						//设置前景的宽度$Line
						//设置圆点的位置dot
						$this.$Line.css("width", eventLeft - normalLeft);
						$this.$Dot.css("left", eventLeft - normalLeft);						
					}
				});
				
			});
		
		
			
			//监听鼠标的释放事件
			this.$Bottom.mouseup(function() {
				
				//移除移动事件
				$(document).off("mousemove");
				$this.isMove = false;
				//设置为拖动完成后播放，不在拖动的时候播放
				var value = (eventLeft - normalLeft) / $this.$Bottom.width();
				//console.log(value);
				callBack(value);
				
			});
		},
		setProgress: function(values) {
			if (this.isMove) return;
			if (values < 0 || values > 100) return;

			this.$Line.css({
				width: values + "%"
			});
			this.$Dot.css({
				left: values + "%"
			});
		},

	}
	Progress.prototype.init.prototype = Progress.prototype;
	window.Progress = Progress;
})(window);
