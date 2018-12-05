<template>
    <div class="resetContainer">
        <head-top :head-title="'重置密码'" goBack="true">

        </head-top>
        <form class="resetForm" >
            <section class="input_container phone-number">
                <input type="text" placeholder="账号" name="phone" maxlength="11" v-model="phoneNumber" @input="inputPhone">
            </section>
            <section class="input_container">
                <input type="text" placeholder="旧密码" name="oldPassword"  v-model="oldPassword" >
            </section>
            <section class="input_container">
                <input type="text" placeholder="输入新密码" name="newPassword"  v-model="newPassword">
            </section>
            <section class="input_container">
                <input type="text" placeholder="确认密码" name="confirmPassword"  v-model="confirmPassword" @input="samePs" >
                <p class="tips" v-show="showText">两次密码输入的不一致</p>
            </section>
            <section class="input_container captcha_code_container">
            <input type="text" placeholder="验证码" name="mobileCode"  maxlength="6" v-model="codeNumber">
            <div class="img_change_img">
                <img :src="captchaCodeImg" v-show="captchaCodeImg">
                <div class="change_img" @click="getCaptchaCode">
                    <p>看不清</p>
                    <p>换一张</p>
                </div>
            </div>
        </section>

        </form>

        <div class="login_container" @click="resetButton" >确认修改</div>
        <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>

    </div>
</template>

<script>
    import headTop from '@/components/header/head'
    import alertTip from '@/components/common/alertTip'
    // import {localapi,proapi} from "../config/env";
    import {mapState,mapMutations} from 'vuex'
    import {mobileCode,checkExsis,sendLogin,getcaptchas,changePassword } from "../service/getData";

    export default {
        data(){
            return {
                phoneNumber:null,
                oldPassword:null,
                newPassword:null,
                confirmPassword:null,
                codeNumber:null,
                captchaCodeImg:null,
                showAlert:false,
                alertText:'',
                rightPhoneNumber:false,
                showText:false,
                computedTime:0,
                timer:null,
                accountType:'mobile',
                validate_token:null,


            }
        },
        components:{
            headTop,
            alertTip,

        },
        created(){
            this.getCaptchaCode();
        },
        computed:{
            inputPhone(){
                this.rightPhoneNumber= /.+/gi.test(this.phoneNumber)?true:false;
            }
        },
        mounted(){
        },
        methods:{
            ...mapMutations(['RECORD_USERINFO']),
            async getCaptchaCode(){
                const res = await getcaptchas();
                this.captchaCodeImg = res.code;
            },
            async getVerifyCode(){
                if(this.rightPhoneNumber){
                    this.computedTime = 30
                    this.timer = setInterval(()=>{
                        this.computedTime--;
                        if(this.computedTime == 0){
                            clearInterval(this.timer);
                        }
                    },1000)
                }
                let res = await checkExsis(this.phoneNumber,this.accountType);
                if(res.message){
                    this.showAlert=true;
                    this.alertText=res.message;
                    return;
                }else if(!res.is_exists){
                    this.showAlert=true;
                    this.alertText="未注册";
                    return;
                }
                let getCode = await mobileCode(this.phoneNumber);
                if(getCode.message) {
                    this.showAlert = true;
                    this.alertText = getCode.message;
                    return
                }
                this.validate_token=getCode.validate_token;
            },
            async resetButton(){
                if(!this.phoneNumber){
                    this.showAlert = true;
                    this.alertText = '输入正确的账号';
                    return
                }else if(!this.oldPassword){
                    this.showAlert = true;
                    this.alertText = '输入旧密码';
                    return
                }else if(!this.newPassword){
                    this.showAlert = true;
                    this.alertText = '输入新密码';
                    return
                }else if(!this.confirmPassword){
                    this.showAlert = true;
                    this.alertText = '输入确认密码';
                    return
                }else if(this.codeNumber){
                    this.showAlert = true;
                    this.alertText = '输入验证码';
                    return
                }else if(this.newPassword != this.confirmPassword){
                    this.showAlert = true;
                    this.alertText = '两次密码输入的不一致';
                    return
                }
                const res = await changePassword(this.phoneNumber,this.oldPassword,this.newPassword,this.confirmPassword,this.mobileCode)
                if(res.message){
                    this.showAlert = true;
                    this.alertText = res.message;
                    this.getCaptchaCode();
                    return
                }else{
                    this.showAlert = true;
                    this.alertText = '密码修改成功';
                }
            },
            closeTip(){
              this.showAlert=false;
            },
            samePs(){
                if( this.newPassword.indexOf(this.confirmPassword) !== 0 ){//&& this.confirmPasswor.length!=this.newPassword.length
                    this.showText=true;
                }else {
                    this.showText=false;
                }

            },
        },

    }
</script>

<style lang="scss" scoped>
    @import "../style/mixin";
    .resetContainer{
        padding-top: 1.95rem;
    }
    .resetForm{
        background-color: #fff;
        margin-top: .6rem;
        .input_container{
            display: flex;
            justify-content: space-between;
            padding: .6rem .8rem;
            border-bottom: 1px solid #f1f1f1;
            input{
                @include sc(.7rem, #666);
            }
            button{
                @include sc(.65rem, #fff);
                font-family: Helvetica Neue,Tahoma,Arial;
                padding: .28rem .4rem;
                border: 1px;
                border-radius: 0.15rem;
            }
            .right_phone_number{
                background-color: #4cd964;
            }
        }
        .phone-number{
            padding: .3rem .8rem;
        }
        .captcha_code_container{
            height: 2.2rem;
            .img_change_img{
                display: flex;
                align-items: center;
                img{
                    @include wh(3.5rem, 1.5rem);
                    margin-right: .2rem;
                }
                .change_img{
                    display: flex;
                    flex-direction: 'column';
                    flex-wrap: wrap;
                    width: 2rem;
                    justify-content: center;
                    p{
                        @include sc(.55rem, #666);
                    }
                    p:nth-of-type(2){
                        color: #3b95e9;
                        margin-top: .2rem;
                    }
                }
            }
        }
    }
    .captcha_code_container{
        height: 2.2rem;
        .img_change_img{
            display: flex;
            align-items: center;
            img{
                @include wh(3.5rem, 1.5rem);
                margin-right: .2rem;
            }
            .change_img{
                display: flex;
                flex-direction: 'column';
                flex-wrap: wrap;
                width: 2rem;
                justify-content: center;
                p{
                    @include sc(.55rem, #666);
                }
                p:nth-of-type(2){
                    color: #3b95e9;
                    margin-top: .2rem;
                }
            }
        }
    }
    .login_container{
        margin: 1rem .5rem;
        @include sc(.7rem, #fff);
        background-color: #4cd964;
        padding: .5rem 0;
        border: 1px;
        border-radius: 0.15rem;
        text-align: center;
    }
    .tips {
        font-size: 0.6rem;
        color: red;
    }

</style>