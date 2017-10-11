<style scoped>
  /**
  * 登录页
  */
</style>

<!--<template>
  <div>
    <Input v-model="value" placeholder="用户名" style="width: 300px"></Input>
    <Input v-model="value" placeholder="密码" style="width: 300px"></Input>
  </div>-->
<template>
  <div>
    <h2 style="margin-top: 100px;text-align: center;">欢迎登陆积分银行
      <!--<p style="text-align: center;" @click="loginOut">注销登录</p>-->
      <!--<p style="text-align: center;" @click="getUserInfo">获取用户信息</p>-->
    </h2>
    <!--<Form ref="login" :model="formItem" :label-width="100" style="width: 500px;padding-top: 100px;margin: 0 auto;">-->
      <!--<Form-item label="用户名" prop="userName">-->
        <!--<Input v-model="formItem.userName" placeholder="请输入" style="width: 300px"></Input>-->
      <!--</Form-item>-->
      <!--<Form-item label="密码" prop="pwd">-->
        <!--<Input v-model="formItem.pwd" placeholder="请输入" style="width: 300px" type="password"></Input>-->
      <!--</Form-item>-->
      <!--<Form-item>-->
        <!--<Button type="primary" @click="handleSubmit()">提交</Button>-->
        <!--<Button type="ghost" @click="resetData('login')" style="margin-left: 8px">取消</Button>-->
      <!--</Form-item>-->
    <!--</Form>-->
  </div>
</template>
<script>
  export default {
    data: function () {
      return {
        formItem: {
          userName: "",
          pwd: ""
        }
      }
    },

    methods: {
      handleSubmit: function () {
        var that = this;
        this.$http.post(window.getHost + "login", {
          "username": this.formItem.userName,
          "password": this.formItem.pwd
        }, {emulateJSON: true}).then(function (data) {
          console.log(data);
          if(data.data.status==200){
            this.$Message.success({content:"登录成功"})
          }
        })
      },
      resetData: function (name) {
        this.$refs[name].resetFields();
      },
      loginOut: function () {//注销登录
        this.$http.get(window.getHost + "loginOut").then(function (data) {
          console.log(data);
        })
      },
      getUserInfo:function(){
        this.$http.get(window.getHost + "loginOut").then(function (data) {
          console.log(data);
        })
      }
    }
  }
  //username=Bill&password=Gates
  //{emulateJSON:true}
  ////{headers:{"content-type":"application/x-www-form-urlencoded"}}
</script>
