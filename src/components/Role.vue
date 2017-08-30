<style scoped>
    /**
    * Created by web17code
    */

</style>

<template>
    <div>
      <!--工具条-->
      <div class="toolBarContent">
        <div class="toolBar" @click="addInfo('addFrom')">
          <Icon type="plus-round" :size="18"></Icon>&nbsp;&nbsp;新增
        </div>
        <!--<div class="toolBar" @click="editInfo('addFrom')">-->
          <!--<Icon type="edit" :size="18"></Icon>&nbsp;&nbsp;修改-->
        <!--</div>-->
        <!--<div class="toolBar" @click="deleteInfo">-->
          <!--<Icon type="trash-a" :size="18"></Icon>&nbsp;&nbsp;删除-->
        <!--</div>-->
        <!--<div class="toolBar" @click="refreshInfo">-->
          <!--<Icon type="refresh" :size="18"></Icon>&nbsp;&nbsp;刷新-->
        <!--</div>-->
      </div>
      <!--列表-->
      <Table border
             :columns="columns"
             :data="dataList"
             @on-selection-change="getItem"></Table>
      <!--分页-->
      <Page :total="total" :current="current"
            @on-change="skipPage"
            show-elevator show-total
            class="pageCss"></Page>
    </div>
</template>

<script>
  export default {
    data: function () {
      return {
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
          menuUrl: '',
          menuName: '',
          menuIcon: '',
          menuContent: ''
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
      }
    },
    methods: {
      //获取列表
      getList: function () {
        this.$http.get(window.getHost + 'menu/list',
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
        console.log(item)
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
        this.formValidate["id"] = this.selectData[0]["id"];
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
          { id: idARR},{emulateJSON: true}).then(function (data) {
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
                console.log(data);
                if (data.data.status == 200) {
                  that.$Message.success(that.submitMsg);
                  this.$refs[name].resetFields();
                }

              });
            }
          })
      },
      //重置表單
      handleReset: function (name) {
        this.$refs[name].resetFields();
      },
      skipPage: function (current) {
        this.current = current;
        this.getList();
      }
    },
    created: function () {//初始化列表
      this.getList();
    }
  }
</script>
