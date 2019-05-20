window.ws = null;
cc.Class({
    extends: cc.Component,

    properties: {
        zhujue         : cc.Node,
		diren         : cc.Node,
		speed           : 200,
		move : false,
		r:0,
		rr:0,
		uid:0,
    },

    onLoad () {
       
	    var that = this;
        // 键盘监听
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
		
		console.log("onload");
		
		 // 打开一个 web socket
        window.ws = new WebSocket('ws://127.0.0.1:3653')
        var uid = Math.ceil(Math.random()*100);
		that.uid = uid;
        var name = '用户'+uid;
        window.ws.onopen = function()
        {
			console.log("onopen");
            // Web Socket 已连接上，使用 send() 方法发送数据
            window.ws.send(JSON.stringify({User: {
                    Username: name,
                    Uid:uid
                }}));
            /*
            window.ws.send(JSON.stringify({REQUEST: {
                    Method: 'leaf',
                    Body: 'leafdata'
                }}));
                */
        };

        // 处理服务器来的消息
        window.ws.onmessage = function (event) {
            var fileReader = new FileReader(); // 用filereader来转blob为arraybuffer
            fileReader.onload = function() {
                var arrayBuffer = this.result; // 得到arraybuffer
                var decoder = new TextDecoder('utf-8')
                var json = JSON.parse(decoder.decode(new DataView(arrayBuffer)))
				
				if(json.RESPONSE!==undefined && json.RESPONSE.Body!==undefined){
					//console.log(json.RESPONSE.Body,json.RESPONSE.Body.length);
					
					let body = JSON.parse(json.RESPONSE.Body);
					
					for(var i in body) {
						 console.log(i,":",body[i]['Position']);
						 if(body[i]['Position']!=""){
							console.log(that.uid , i);
							if(that.uid != i){
								console.log(that.uid);
								let position = JSON.parse(body[i]['Position']);
								if(position['r']>that.rr){
									that.zhujue.x = parseFloat(position['x']);
									that.rr = position['r'];
								}
							}
						 }
					}
					
				}
				
                //console.log('response text msg: ' + JSON.stringify(json));
            };
            fileReader.readAsArrayBuffer(event.data); // 此处读取blob
        };

        window.ws.onclose = function()
        {
            // 关闭 websocket
            console.log("ws closed");
        };
		
    },
	
	update (dt) {
        // 左右不可同时
		if(this.move){
			let x = this.zhujue.x + this.speed * dt;
			// 限位
			if (x >= 480) {
				x = 0;
			} else if (x <= -480) {
				x = 0;
			}
			
			this.zhujue.x = x;
			this.r++;
			let body = {x:x,r:this.r};
	
			let msg = JSON.stringify({REQUEST: {
						Method: 'leaf',
						Body: JSON.stringify(body)
					}});
					
					console.log(msg);
			window.ws.send(msg);
		}
    },

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
				this.move = true;
                //this.zhujue_com.isLeft = true;
                //this.zhujue_com.animMove();
				//this.zhujue.rotation = -30;
                break;
            case cc.macro.KEY.d:
			    this.move = false;
                //this.zhujue_com.isRight = true;
                //this.zhujue_com.animMove();
				//this.zhujue.rotation = 30;
                //break;
			case cc.macro.KEY.w:
			    this.zhujue_com.animJump();
                break;
            case cc.macro.KEY.k:
                this.zhujue_com.isAtk = true;
                this.zhujue_com.animAtk();
                break;
            case cc.macro.KEY.j:
                this.zhujue_com.animJump();
                break;
        }
    },

    onKeyUp: function (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
                this.zhujue_com.isLeft = false;
                this.zhujue_com.animMove();
				if(!this.zhujue_com.isRight){
					this.zhujue.rotation = 0;
				}
                break;
            case cc.macro.KEY.d:
                this.zhujue_com.isRight = false;
                this.zhujue_com.animMove();
				if(!this.zhujue_com.isLeft){
					this.zhujue.rotation = 0;
				}
                break;
            case cc.macro.KEY.k:
                this.zhujue_com.isAtk = false;
                this.zhujue_com.animAtk();
                break;
        }
    }
});
