cc.Class({
    extends: cc.Component,

    properties: {
        // 主角4个状态
        isRight         : false,
        isLeft          : false,
        isAtk           : false,
        isJump          : false,
        // 移动动画状态
        anim_isMove     : false,
        // 主角速度
        speed           : 200
    },

    onLoad () {
        // 获取主角身上动画组件
        this.zhujue_anim = this.node.getComponent(cc.Animation);
    },

    animMove: function () {
        // 动画播放
        if (this.isLeft || this.isRight) {
            if (!this.anim_isMove) {
                // 播放move动画
                this.zhujue_anim.play('zhujue_move');
                this.anim_isMove = true;
            }
        } else {
            this.zhujue_anim.stop('zhujue_move');
            this.anim_isMove = false;
        }
    },

    animAtk: function () {
        if (this.isAtk) {
            this.zhujue_anim.play('zhujue_atk');  
        } else {}
    },

    animJump: function () {
        if (!this.isJump) {
            this.isJump = true;
            this.node.runAction(cc.sequence(cc.jumpBy(1,cc.v2(0,0),150,1),cc.callFunc(function(){
                this.isJump = false;
            }.bind(this))));
        } else {}
    },

    update (dt) {
        // 左右不可同时
        if (this.isRight) {
            this.node.scaleX = 1.5;
            this.node.x += this.speed * dt;
        } else if (this.isLeft) {
            this.node.scaleX = -1.5;
            this.node.x -= this.speed * dt;
        }
        // 限位
        if (this.node.x >= 480) {
            this.node.x = 480;
        } else if (this.node.x <= -480) {
            this.node.x = -480;
        }
    },
});
