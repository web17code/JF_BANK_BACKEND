<style scoped>
  .layout {
    border: 0px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }

  .layout .content {
    min-height: 92vh;
  }

  .layout-breadcrumb {
    padding: 10px 15px 0;
  }

  .layout-content {
    min-height: 80vh;
    margin:10px 15px;
    overflow: hidden;
    background: #fff;
    border-radius: 4px;
  }

  .layout-content-main {
    padding: 10px;
  }

  .layout-copy {
    text-align: center;
    padding: 10px 0 20px;
    color: #9ea7b4;
  }

  .layout-menu-left {
    background: #464c5b;
  }

  .layout-header {
    height: 8vh;
    line-height: 8vh;
    font-size: 20px;
    background: #fff;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .1);
    text-align: center;
  }

  .layout-logo-left {
    width: 90%;
    height: 30px;
    background: #5b6270;
    border-radius: 3px;
    margin: 15px auto;
  }

  .layout-ceiling-main a {
    color: #9ba7b5;
  }

  .layout-hide-text .layout-text {
    display: none;
  }

  .ivu-col {
    transition: width .2s ease-in-out;
  }
</style>
<template>
  <div class="layout">
    <div class="layout-header">
      <!--<i-button type="text" @click="toggleClick">-->
      <!--<Icon type="navicon" size="32"></Icon>-->
      <!--</i-button>-->
      积分银行后台管理
    </div>
    <Row type="flex" class="content">
      <i-col span="3" class="layout-menu-left">
        <Menu :active-name="$route.path.substring(1)" theme="dark" width="auto" @on-select="goRouter">
          <!--<div class="layout-logo-left"></div>-->
          <!--<Menu-item name="Dictionary">
            <Icon type="ios-navigate" :size="18"></Icon>
            <span class="layout-text">数据字典</span>
          </Menu-item>-->
          <!--<Menu-item name="User">-->
            <!--<Icon type="ios-keypad" :size="18"></Icon>-->
            <!--<span class="layout-text">用户管理</span>-->
          <!--</Menu-item>-->
          <!--<Menu-item name="Log">-->
            <!--<Icon type="ios-analytics" :size="18"></Icon>-->
            <!--<span class="layout-text">日志管理</span>-->
          <!--</Menu-item>-->
          <Menu-item name="Menu">
            <Icon type="ios-analytics" :size="18"></Icon>
            <span class="layout-text">菜单管理</span>
          </Menu-item>
          <!--<Menu-item name="Role">-->
            <!--<Icon type="person" :size="18"></Icon>-->
            <!--<span class="layout-text">角色管理</span>-->
          <!--</Menu-item>-->
          <Menu-item name="App">
            <Icon type="hammer" :size="18"></Icon>
            <span class="layout-text">应用管理</span>
          </Menu-item>
          <Menu-item name="uploadTable">
            <Icon type="ios-cloud-upload" :size="18"></Icon>
            <span class="layout-text">上传表格</span>
          </Menu-item>
        </Menu>
      </i-col>
      <i-col span="21">
        <div class="layout-breadcrumb" style="overflow: hidden;">
          <Breadcrumb>
            <Breadcrumb-item >后台管理</Breadcrumb-item>
            <Breadcrumb-item >{{$route.name}}</Breadcrumb-item>
            <a href="logout.jsp" style="float: right;color: #666;">注销</a>
            <a style="float: right;color: #666;padding-right: 15px;cursor: default;">
              {{nowName}}
            </a>
          </Breadcrumb>

        </div>
        <div class="layout-content">
          <div class="layout-content-main">
            <router-view></router-view>
          </div>
        </div>
        <div class="layout-copy">
          2011-2016 &copy; TalkingData
        </div>
      </i-col>
    </Row>
  </div>
</template>
<script>
  export default {
    data () {
      return {
        nowName:""
      }
    },
    methods: {
      goRouter: function (name) {
        this.$router.push({path: name})
        //this.$router.push({path: name, query: {user: "zhuhj"}})
        //this.$router.push({path: name, params:{user: "zhuhj"}})
      },
      getAccountInfo: function () {
        var that = this;
        this.$http.post(window.getHost + "money/account",
          {},
          {emulateJSON: true}).then(function (data) {
          that.nowName = data.data.data.XM;
        })
      }
    },
    created:function () {
      this.getAccountInfo();
    }
  }
</script>
