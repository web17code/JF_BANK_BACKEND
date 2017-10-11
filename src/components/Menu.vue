<style scoped>
  /*该项目仅在开发时使用，用来配置菜单和路由*/
</style>

<template>
  <div>
    <!--工具条-->
    <div class="toolBarContent">
      <div class="toolBar" @click="addInfo('addFrom')">
        <Icon type="plus-round" :size="18"></Icon>&nbsp;&nbsp;新增
      </div>
      <div class="toolBar" @click="editInfo('addFrom')">
        <Icon type="edit" :size="18"></Icon>&nbsp;&nbsp;修改
      </div>
      <div class="toolBar" @click="deleteInfo">
        <Icon type="trash-a" :size="18"></Icon>&nbsp;&nbsp;删除
      </div>
      <div class="toolBar" @click="refreshInfo">
        <Icon type="refresh" :size="18"></Icon>&nbsp;&nbsp;刷新
      </div>
      <div class="toolBar" @click="lookMenuIcon">
        <Icon type="grid" :size="18"></Icon>&nbsp;&nbsp;查看菜单图标
      </div>
    </div>
    <!--列表-->
    <Table border
           :columns="columns"
           :data="dataList"
           no-data-text=""
           @on-selection-change="getItem"></Table>
    <!--分页-->
    <Page :total="total" :current="current"
          @on-change="skipPage"
          show-elevator show-total
          class="pageCss"></Page>
    <!--addInfoModal 增加信息或修改信息的对话框-->
    <Modal
      ref="addForm"
      v-model="showFormModal"
      :title="ModalTitle"
      :loading="false"
    >
      <Form ref="addFrom" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Form-item label="菜单文字" prop="menuName">
          <Input v-model="formValidate.menuName" placeholder="请输入菜单文字"></Input>
        </Form-item>
        <Form-item label="菜单路由(菜单的名字)" prop="menuUrl">
          <Input v-model="formValidate.menuUrl" placeholder="请输入菜单名字（）作为路由使用"></Input>
        </Form-item>
        <Form-item label="菜单图标" prop="menuIcon">
          <Input v-model="formValidate.menuIcon" placeholder="请输入系统提供的图标名称"></Input>
        </Form-item>
        <Form-item label="描述" prop="menuContent">
          <Input v-model="formValidate.menuContent" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="请输入..."></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('addFrom')">提交</Button>
          <Button type="ghost" @click="handleReset('addFrom')" style="margin-left: 8px">重置</Button>
        </Form-item>
      </Form>
    </Modal>
    <Modal
      ref="roleAndMenu"
      v-model="show_roleAndMenu_Modal"
      @on-ok="changeRoleMenu"
      title="角色授权"
      :loading="false"
    >
      <Form ref="roleAndMenuFrom" :model="roleAndMenuData" :label-width="80">
        <p>该路径{{changeMenuRole.menuUrl}}将授予以下角色:</p>
        <Form-item label="" >
          <!--<Input v-model="roleAndMenuData.txt" placeholder="请输入菜单文字"></Input>-->
          <CheckboxGroup v-model="social">
            <Checkbox :label="item.id" v-for="item in Roledata" :key="item.id">
              <span>{{item.roleName}}</span>
            </Checkbox>
          </CheckboxGroup>
        </Form-item>
        <!--<Form-item>-->
          <!--<Button type="primary" @click="changeRoleMenu('roleAndMenuFrom')">提交</Button>-->
        <!--</Form-item>-->
      </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        //角色数据
        Roledata:[],
        //列头项
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '菜单ID',
            key: 'id'
          },
          {
            title: '菜单文字',
            key: 'menuName'
          },
          {
            title: '菜单URL',
            key: 'menuUrl'
          },
          {
            title: '菜单图标',
            key: 'menuIcon'
          },
          {
            title: '菜单描述',
            key: 'menuContent'
          },
          {
            align:"center",
            title:"操作",
            render:(h,params) => {
              return h("Button",{
                /*https://cn.vuejs.org/v2/guide/render-function.html*/
                on:{
                    click:() => {
                        this.roleAndMenu(params);
                    }
                }
              },"授予角色")
            }
          }
        ],
        dataList: [],//菜单列表数据
        current: 1,//当前页码，初始值为1
        total: 0,//总条数，默认0
        selectData: [],//选中的数据
        submitMsg: "",//表单提交后的结果提示
        submitUrl: "",//表单提交的url
        //表单数据
        formValidate: {
          id:'',
          menuUrl: '',
          menuName: '',
          menuIcon: '',
          menuContent: ''
        },
        //角色数据
        roleAndMenuData:{
          txt:""
        },
        //表单校验规则
        ruleValidate: {
          menuUrl: [
            {required: true, message: '菜单名字不能为空', trigger: 'blur'}
          ],
          menuName: [
            {required: true, message: '菜单文字不能为空', trigger: 'blur'}
          ],
          menuIcon: [
            {required: true, message: '菜单图标不能为空', trigger: 'blur'}
          ],
          menuContent: [
            {required: true, message: '请输入该菜单的介绍', trigger: 'blur'},
          ]
        },
        ModalTitle: "",//莫态框的标题
        showFormModal: false,//控制addInfo模态框的显示隐藏
        show_roleAndMenu_Modal:false,//控制角色菜单的模态框的显示隐藏
        changeMenuRole:{},
        social:[]
      }
    },
    methods: {
      //獲取角色列表
      getRoleList:function(){
        this.$http.post(window.getHost + 'role/list?R='+Math.random(),
          {}, {emulateJSON: true}).then(function (data) {
          this.Roledata = data.data.data;
        })
      },
      //获取列表
      getList: function () {
        this.$http.get(window.getHost + 'menu/list?R='+Math.random(),
          {
            params: {page: this.current, rows: 10}
          }).then(function (data) {
          this.dataList = data.data.data;
          this.total = data.data.total;
        })
      },
      //获取选中的数据
      getItem: function (item, row) {
        this.selectData = item;
      },
      //添加按钮显示模态框
      addInfo: function (name) {
        this.ModalTitle = "新增用户信息";
        this.submitMsg = "增加成功";
        this.submitUrl = "menu/add";
        this.showFormModal = true;
        this.handleReset(name);
      },
      //修改按钮显示模态框
      editInfo: function (name) {
        if (this.selectData.length != 1) {//若果选择的不是一项，提示错误
          this.$Message.error("请选择一项进行修改");
          return false;
        }
        this.submitMsg = "修改成功";
        this.submitUrl = "menu/update";
        //先重置表单
        this.$refs[name].resetFields();
        this.ModalTitle = "修改用户信息";
        this.showFormModal = true;
        //再为表单赋值
        for (var key in this.formValidate) {
          this.formValidate[key] = this.selectData[0][key];
        }
      },
      //删除的请求
      http_delete: function () {
        var idARR = [];
        for (var i = 0; i < this.selectData.length; i++) {
          idARR.push(this.selectData[i]["id"]);
        }
        this.$http.post(window.getHost + 'menu/deleteBatch',
          { ids: idARR.join(',')},{emulateJSON: true}).then(function (data) {
          if (data.data.status == 200) {
            this.$Message.success("删除成功！");
            this.getList();
          } else {
            this.$Message.error("删除失败！");
          }
        })
      },
      //删除信息
      deleteInfo: function () {
        var that = this;
        if (this.selectData.length == 0) {
          this.$Message.error("请选择一项进行修改");
          return false;
        }
        this.$Modal.confirm({
          title: '确认删除',
          content: '<p>您要删除所选的多项吗？</p>',
          onCancel: function () {
            return false;
          },
          onOk: function () {
            that.http_delete();
          }
        })
      },
      //查看菜单图标
      lookMenuIcon: function () {
        this.$router.push("/MenuIcon");
      },
      //刷新列表
      refreshInfo: function () {
        this.getList();
        this.$Message.success("刷新完毕");
      },
      //提交表单
      handleSubmit: function (name) {
        var that = this;
        this.$refs[name].validate(
          function (valid) {
            if (!valid) {
              that.$Message.error('表单验证失败!');
            } else {
              that.$http.post(window.getHost + that.submitUrl, {
                id: that.formValidate.id,
                menuName: that.formValidate.menuName,
                menuUrl: that.formValidate.menuUrl,
                menuContent: that.formValidate.menuContent,
                menuIcon: that.formValidate.menuIcon
              }, {emulateJSON: true}).then(function (data) {
                if (data.data.status == 200) {
                  that.$Message.success(that.submitMsg);
                  this.getList();
                  this.$refs[name].resetFields();
                  document.getElementsByClassName('ivu-icon-ios-close-empty')[0].click();//关闭弹框
                }

              });
            }
          })
      },
      //重置表單
      handleReset: function (name) {
        this.$refs[name].resetFields();
      },
      //修改菜單授予的角色
      changeRoleMenu:function(name){
          var that = this;
          console.log("提交角色授予修改");
          console.log(this.social);
        //rmenu/add/batch
        that.$http.post(window.getHost +"rmenu/add/batch", {
          fkMenu:that.changeMenuRole.id,
          fkRoles:that.social.join(',')
        }, {emulateJSON: true}).then(function (data) {
            if (data.data.status == 200) {
              that.$Message.success("授权菜单角色成功");
            }else{
              that.$Message.error("授权菜单角色失败");
            }
        })
      },
      skipPage: function (current) {
        this.current = current;
        this.getList();
      },
      //獲取到角色授予請況展開模態框
      roleAndMenu:function(params){
        var that = this;
        console.log("獲取授予的角色");
        this.changeMenuRole = params.row;//該行的菜單數據
        console.log(this.changeMenuRole);
        this.$http.post(window.getHost + 'role/menuList?R='+Math.random(),
          {fkMenu:params.row.id}, {emulateJSON: true}).then(function (data) {
          if(data.data.status==200){
            that.show_roleAndMenu_Modal = true;
            var array = [];
            for(var i=0; i<data.data.data.length;i++){
              array[i] = data.data.data[i].id;
            }
            that.social = array;
          }
        })
      }
    },
    created: function () {//初始化列表
      this.getList();
      this.getRoleList();
    }
  }
</script>
