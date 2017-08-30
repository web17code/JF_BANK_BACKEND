<style scoped>
  /*应用管理页面*/
</style>

<template>
  <div>
    <!--工具条-->
    <div class="toolBarContent">
      <div class="toolBar" @click="addInfo('MyForm')">
        <Icon type="plus-round" :size="18"></Icon>&nbsp;&nbsp;新增
      </div>
      <div class="toolBar" @click="editInfo('MyForm')">
        <Icon type="edit" :size="18"></Icon>&nbsp;&nbsp;修改内容
      </div>
      <div class="toolBar" @click="editState">
        <Icon type="edit" :size="18"></Icon>&nbsp;&nbsp;修改状态
      </div>
      <div class="toolBar" @click="deleteInfo">
        <Icon type="trash-a" :size="18"></Icon>&nbsp;&nbsp;删除
      </div>
      <div class="toolBar" @click="refreshInfo">
        <Icon type="refresh" :size="18"></Icon>&nbsp;&nbsp;刷新
      </div>
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
    <!--addInfoModal 增加信息或修改信息的对话框-->
    <Modal
      ref="addForm"
      v-model="showFormModal"
      :title="ModalTitle"
      :loading="false"
    >
      <Form ref="MyForm" :model="formData" :rules="ruleValidate" :label-width="80">
        <Form-item label="应用名称" prop="appName">
          <Input v-model="formData.appName" placeholder="请输入应用名称"></Input>
        </Form-item>
        <Form-item label="应用地址" prop="appUrl">
          <Input v-model="formData.appUrl" placeholder="请输入应用地址"></Input>
        </Form-item>
        <Form-item label="应用认证密码" prop="appSecret">
          <Input v-model="formData.appSecret" placeholder="请输入认证密码"></Input>
        </Form-item>
        <Form-item label="所属公司" prop="company">
          <Input v-model="formData.company" placeholder="请输入公司名称"></Input>
        </Form-item>
        <Form-item label="奖励金额数量" prop="amountReward">
          <InputNumber v-model="formData.amountReward" :min="0"></InputNumber>
        </Form-item>
        <Form-item label="应用简介" prop="content">
          <Input v-model="formData.content" placeholder="请输入少于35个字"></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('MyForm')">提交</Button>
          <Button type="ghost" @click="handleReset('MyForm')" style="margin-left: 8px">重置</Button>
        </Form-item>
      </Form>
    </Modal>
    <!--应用状态修改的莫态框-->
    <Modal
      ref="addForm"
      v-model="showStateModal"
      :title="ModalTitle"
      :loading="false"
      @on-ok="http_editState"
    >
      <Select v-model="openOrClose" style="width:200px">
        <Option value="close">关闭</Option>
        <Option value="open">启用</Option>
      </Select>
    </Modal>
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
            align: 'center',
            fixed: "left"
          },
          {
            title: '应用名称',
            key: 'appName',
            width: 150,
            fixed: "left"
          },
          {
            title: '应用ID',
            key: 'appId',
            width: 250
          },

          {
            title: '应用URL',
            key: 'appUrl',
            width: 300
          },
          {
            title: '应用认证密码',
            key: 'appSecret',
            width: 300
          },
          {
            title: '所属公司',
            key: 'company',
            width: 150
          },
          {
            title: '应用状态',
            key: 'status',
            width: 100
          },
          {
            title: '应用简介',
            key: 'content',
            width: 300
          },
          {
            title: '浏览应用奖励金额数量',
            key: 'amountReward',
            width: 100
          }
        ],
        //表单数据
        formData: {
          appId: '',
          appName: '',
          appUrl: '',
          appSecret: '',
          company: '',
          content: "",
          amountReward: 0
        },
        //表单校验规则
        ruleValidate: {
          appName: [
            {required: true, message: '应用名称不能为空', trigger: 'blur'}
          ],
          appUrl: [
            {required: true, message: '应用url不能为空', trigger: 'blur'},
            {type: "url", message: '应用url格式不规范', trigger: 'blur'}
          ],
          appSecret: [
            {required: true, message: '应用认证密码不能为空', trigger: 'blur'}
          ],
          content: [
            {type: "string", message: '不能超过35个字哦', max: 35, trigger: 'blur'}
          ]
        },
        openOrClose: '',//状态代码
        Url_getList: "app/list",//获取列表的url
        Url_delete: "app/delete",//删除某一项,或批量删除
        dataList: [],//菜单列表数据
        current: 1,//当前页码，初始值为1
        total: 0,//总条数，默认0
        selectData: [],//选中的数据
        submitMsg: "",//表单提交后的结果提示
        submitUrl: "",//表单提交的url
        ModalTitle: "",//莫态框的标题
        showFormModal: false,//控制addInfo模态框的显示隐藏
        showStateModal: false//控制editState模态框的显示隐藏
      }
    },
    methods: {
      //获取列表
      getList: function () {
        var url = this.Url_getList;
        this.$http.post(window.getHost + url,
          {
            page: this.current, rows: 10
          }, {emulateJSON: true}).then(function (data) {
          this.dataList = data.data.data;
          this.total = data.data.total;
        })
      },
      //获取选中的数据
      getItem: function (item, row) {
        this.selectData = item;
      },
      //添加按钮：显示模态框
      addInfo: function (name) {
        this.ModalTitle = "新增应用信息";
        this.submitMsg = "增加成功";
        this.submitUrl = "app/insert";
        this.showFormModal = true;
        this.handleReset(name);
      },
      //修改按钮：显示模态框
      editInfo: function (name) {
        if (this.selectData.length != 1) {//若果选择的不是一项，提示错误
          this.$Message.error("请选择一项进行修改");
          return false;
        }
        this.submitMsg = "修改成功";
        this.submitUrl = "app/update";
        //先重置表单
        this.$refs[name].resetFields();
        this.ModalTitle = "修改应用信息";
        this.showFormModal = true;
        //再为表单赋值
        for (var key in this.formData) {
          this.formData[key] = this.selectData[0][key];
        }
      },
      //修改应用状态
      editState: function () {
        if (this.selectData.length != 1) {//若果选择的不是一项，提示错误
          this.$Message.error("请选择一项进行修改");
          return false;
        }
        this.showStateModal = true;
      },
      //提交应用状态修改
      http_editState: function () {
        var appId = this.selectData[0]['appId'];
        var openOrClose = this.openOrClose;
        this.$http.post(window.getHost + 'app/openClose',
          {appId: appId, openOrClose: openOrClose}, {emulateJSON: true})
          .then(function (data) {
            if (data.data.status == 200) {
              this.$Message.info(data.data.msg);
              this.getList();
            }
          })
      },
      //删除的请求
      http_delete: function () {
        var that = this;
        var idARR = [];
        for (var i = 0; i < this.selectData.length; i++) {
          idARR.push(this.selectData[i]["appId"]);
        }
        this.$http.post(window.getHost + that.Url_delete,
          {appId: idARR.join(',')}, {emulateJSON: true}).then(function (data) {
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
                appId: that.formData.appId,
                appName: that.formData.appName,
                appUrl: that.formData.appUrl,
                appSecret: that.formData.appSecret,
                company: that.formData.company,
                status: 1,
                content: that.formData.content,
                amountReward: that.formData.amountReward,
                company: that.formData.company,
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
      skipPage: function (current) {
        this.current = current;
        this.getList();
      }
    },
    created: function () {//初始化列表
      this.getList();
    },

  }
</script>
