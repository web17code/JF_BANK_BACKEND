<style scoped>

</style>

<template>
  <div>
    <!--工具条-->
    <div class="toolBarContent">
      <div class="toolBar" @click="addInfo('addFrom')">
        <Icon type="plus-round" :size="18"></Icon>&nbsp;&nbsp;新增
      </div>
      <div class="toolBar" @click="editInfo">
        <Icon type="edit" :size="18"></Icon>&nbsp;&nbsp;修改
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
           :columns="columns1"
           :data="data1"
           @on-selection-change="getItem"></Table>
    <!--分页-->
    <Page :total="100" show-elevator show-total class="pageCss"></Page>
    <!--addInfoModal 增加信息或修改信息的对话框-->
    <Modal
      ref="addForm"
      v-model="showFormModal"
      :title="ModalTitle"
      :loading="false"
    >
      <Form ref="addFrom" :model="formValidate" :rules="ruleValidate" :label-width="80">
        <Form-item label="姓名" prop="name">
          <Input v-model="formValidate.name" placeholder="请输入姓名"></Input>
        </Form-item>
        <Form-item label="邮箱" prop="mail">
          <Input v-model="formValidate.mail" placeholder="请输入邮箱"></Input>
        </Form-item>
        <Form-item label="城市" prop="city">
          <Select v-model="formValidate.city" placeholder="请选择所在地">
            <Option value="beijing">北京市</Option>
            <Option value="shanghai">上海市</Option>
            <Option value="shenzhen">深圳市</Option>
          </Select>
        </Form-item>
        <Form-item label="性别" prop="sex">
          <Radio-group v-model="formValidate.sex">
            <Radio label="male">男</Radio>
            <Radio label="female">女</Radio>
          </Radio-group>
        </Form-item>
        <Form-item label="爱好" prop="interest">
          <Checkbox-group v-model="formValidate.interest">
            <Checkbox label="吃饭"></Checkbox>
            <Checkbox label="睡觉"></Checkbox>
            <Checkbox label="跑步"></Checkbox>
            <Checkbox label="看电影"></Checkbox>
          </Checkbox-group>
        </Form-item>
        <Form-item label="介绍" prop="desc">
          <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}"
                 placeholder="请输入..."></Input>
        </Form-item>
        <Form-item>
          <Button type="primary" @click="handleSubmit('addFrom')">提交</Button>
          <Button type="ghost" @click="handleReset('addFrom')" style="margin-left: 8px">重置</Button>
        </Form-item>
      </Form>
    </Modal>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        showFormModal: false,//控制addInfo模态框的显示隐藏
        columns1: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name'
          },
          {
            title: '年龄',
            key: 'age'
          },
          {
            title: '地址',
            key: 'address'
          }
        ],
        data1: [
          {
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居',
            mail: 'web17code@163.com',
            city: 'beijing',
            sex: 'male',
            interest: ["吃饭","吃饭饭"],
            desc: '不够20个字'
          },
          {
            name: '张小刚',
            age: 25,
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            address: '深圳市南山区深南大道'
          },
          {
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            age: 25,
            address: '北京市海淀区西二旗'
          },
          {
            name: '李小红',
            age: 30,
            address: '上海市浦东新区世纪大道'
          },
          {
            name: '周小伟',
            age: 26,
            address: '深圳市南山区深南大道'
          },
          {
            name: '王小明',
            age: 18,
            address: '北京市朝阳区芍药居'
          },
          {
            name: '张小刚',
            age: 25,
            address: '北京市海淀区西二旗'
          }
        ],
        ModalTitle: "",
        formValidate: {//表单数据
          name: '',
          mail: '',
          city: '',
          sex: '',
          interest: [],
          desc: ''
        },
        selectData: [],//选中的数据
        ruleValidate: {
          name: [
            {required: true, message: '姓名不能为空', trigger: 'blur'}/*,
             { pattern:/^1994/, message: '姓名不是1994', trigger: 'blur'}*/
          ],
          mail: [
            {required: false, message: '邮箱不能为空', trigger: 'blur'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
          ],
          city: [
            {required: true, message: '请选择城市', trigger: 'change'}
          ],
          sex: [
            {required: true, message: '请选择性别', trigger: 'change'}
          ],
          interest: [
            {required: true, type: 'array', min: 1, message: '至少选择一个爱好', trigger: 'change'},
            {type: 'array', max: 2, message: '最多选择两个爱好', trigger: 'change'}
          ],
          /*date: [
           {required: true, type: 'date', message: '请选择日期', trigger: 'change'}
           ],
           time: [
           {required: true, type: 'date', message: '请选择时间', trigger: 'change'}
           ],*/
          desc: [
            {required: true, message: '请输入个人介绍', trigger: 'blur'},
            {type: 'string', min: 20, message: '介绍不能少于20字', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //获取选中的数据
      getItem: function (item, row) {
        this.selectData = item;
        console.log(this.selectData)
      },
      //添加按钮显示模态框
      addInfo: function (name) {
        this.ModalTitle = "新增用户信息";
        this.showFormModal = true;
        this.handleReset(name);
      },
      //修改按钮显示模态框
      editInfo: function () {
        if (this.selectData.length != 1) {//若果选择的不是一项，提示错误
          this.$Message.error("请选择一项进行修改");
          return false;
        }
        this.ModalTitle = "修改用户信息";
        this.showFormModal = true;
        //为表单赋值
        for(var key in this.formValidate){
          this.formValidate[key] = this.selectData[0][key];
        }
      },
      //删除信息
      deleteInfo: function () {
        console.log("删除数据列表");
      },
      //提交表单
      //刷新列表
      refreshInfo:function(){
        console.log("清空列表");
      },
      handleSubmit: function (name) {
        var that = this;
        this.$refs[name].validate(
          function (valid) {
            if (!valid) {
              that.$Message.error('表单验证失败!');
            } else {
              that.$http.post(window.getHost + 'url', {}).then(function () {}, function () {});
              that.$Message.success('提交成功!');
            }
          })
      },
      //重置表單
      handleReset: function (name) {
        this.$refs[name].resetFields();
      }
    },
    created: function () {
    },
    mounted: function () {
      /*console.log(this.$route.path)
       console.log(this.$route.query)
       console.log(this.$route.name)
       console.log(this.$route.params)
       console.log(this.$route)*/
    }
  }
</script>
