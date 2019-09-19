//封装类的例子

// $(function(){
// 	function Dog(){
// 		//return什么对象他就返回什么对象
// 		//这里本质是new 的init();
// 		return new Dog.prototype.init();
// 	}
// 	//自定义Dog的原型对象
// 	Dog.prototype = {
// 		//constructor是原型中的属性，函数Dog.prototype指向它，实例化对象，var d = new Dog(); d.__proto__也指向它
// 		constructor:Dog,
// 		
// 		//init是初始化函数
// 		init: function(){
// 			this.name = "悲喜";
// 			this.age = 1;
// 		},
// 		//比如这里定义一个方法say:function(){}
// 		say:function(){
// 			console.log(this.name,this.age); 
// 		}
// 	}
// 	/*通过哪个函数创建的对象，那这个对象的__proto__就只向那个函数的原型*/
// 	
// 	//将init函数的原型对象改为dog的原型对象
// 	Dog.prototype.init.prototype = Dog.prototype;
// 	//实例化对象,上面用了return后，这里实例化出来的实际是init函数的对象，所以直接调用就会报错，该进方法：将init函数的原型对象改为dog的原型对象
// 	var d = new Dog();
// 	//直接调用say方法,这里会出现undefined,没有初始化，就没有name和age,这里需要先调用初始化函数
// 	d.init();
// 	d.say();
// });


// 编写一个闭包
//传递window参数的目的是为了将闭包中需要暴露给外界使用的东西，变成全局变量
(function(window) {
		//创建一个Player函数
		function Player($audio) {
			//通过原型中的init()函数来实例化一个对象，但是下面要设置这个初始化函数的原型为Player所指向的原型,如果没有设置，那直接用对象调用Player原型中的方法会报错,实际上是在init()的原型中去寻找该方法，找不到自然会报错
			return new Player.prototype.init($audio);
		}
		//设置它的原型
		Player.prototype = {
			constructor: Player,
			//歌曲数据data存放在数组中
			musicList: [],
			//创建初始化函数
			init: function($audio) {
				this.$audio = $audio;
				this.audio = $audio.get(0);
			},
			//记录当前是哪一首
			currentIndex:-1,
			playMusic: function(index, music) {
				//判断是否是同一首音乐
				if (this.currentIndex == index) {
					//判断播放的暂停与开始
					if (this.audio.paused) {
						//就开始播放
						this.audio.play();
					} else {
						//否则暂停
						this.audio.pause();
					}
				} else {
					//不是同一首，切换src地址播放
					//josn文件中music路径不要用特殊字符，容易出错
					this.$audio.attr("src",music.link_url);
					this.audio.play();
					//console.log(music.link_url);
					//记录传入的索引
					this.currentIndex = index;
				}
			},
			
			preIndex: function(){
				var index =this.currentIndex-1;
				if(index<0){
					index = this.musicList.length-1;
				}
				return index;
			},
			nextIndex:function(){
				var index =this.currentIndex+1;
				if(index>this.musicList.length-1){
					index =0;
				}
				return index;
			},
			//除了从界面删掉，还要删除后台数据
			changeMusic:function(index){
				//删除对应索引
				this.musicList.splice(index,1);
				
				//判断当前删除的音乐是否是正在播放音乐前面的音乐
				//如果是
				if(index<this.currentIndex){
					this.currentIndex = this.currentIndex-1;
				}
			},
			//总时长duration和当前时长currentTime
			musicTimeUpdate:function(callBack){
				
				var $this = this;
				//监听播放的进度
				this.$audio.on("timeupdate",function(){
					
					//总时长和当前时长(时间以秒为单位，需要转化)
					var duration = $this.audio.duration;
					var currentTime = $this.audio.currentTime;
					//格式转化
					var timeStr = $this.formatDate(currentTime,duration);
					callBack(currentTime,duration,timeStr);
					
				});
			},
			formatDate:function(currentTime,duration){
				//结束时间格式化
				var endMin = parseInt(duration/60);
				var endSec = parseInt(duration%60);
				if(endMin<10){
					endMin = "0"+endMin;
				}
				
				if(endSec<10){
					endSec = "0"+endSec;
				}
				
				//开始时间格式化
				var startMin = parseInt(currentTime/60);
				var startSec = parseInt(currentTime%60);
				if(startMin<10){
					startMin = "0"+startMin;
				}
				
				if(startSec<10){
					startSec = "0"+startSec;
				}
				
				return startMin+":"+startSec+" / "+endMin+":"+endSec;
				
			},
			
			musicSeekTo:function(value){
				
				if(isNaN(value)) return;
				this.audio.currentTime = this.audio.duration*value;
			},
			
			musicVoiceSeekTo:function(value){
				if(isNaN(value)) return;
				if(value<0 || value>1) return;
				//设置声音0-1，没有声音-最大
				this.audio.volume = value;
			},
			
			
		}
	//设置这个初始化函数的原型为Player所指向的原型
	Player.prototype.init.prototype = Player.prototype; window.Player = Player;
})(window);
