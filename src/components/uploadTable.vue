<style scoped>
  /**
  * Created by web17code
  */
  .title {
    margin-top: 10px;
    margin-bottom: 10px;
    color: #666;
    font-size: 16px;
    padding-left: 10px;
  }

  .submit_btn {
    float: right;
    margin-top: 20px;
    margin-bottom: 20px;
  }
</style>

<template>
  <div>
    <div style="height:45vh;overflow: auto;">
      <p class="title">模板下载</p>
      <Table :columns="columns1"
             :data="data1"
             no-data-text=""
             :loading=loading></Table>
    </div>
    <div>
      <p class="title">导入Excel</p>
      <div style="overflow: hidden">
        <Upload
          :action="uploadUrl"
          name="fileName"
          accept="application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :show-upload-list="false"
          :on-success="handleSuccess"
          :on-error="handleError"
          :with-credentials="isTrue">
          <Button type="ghost" icon="ios-cloud-upload-outline">选择要上传文件的excel文件</Button>
        </Upload>
        <div v-if="file !== null">待上传文件：{{ file.name }}</div>
        <Input v-model="remarkes" type="textarea" :rows="4" placeholder="请输入..."></Input>
        <Button type="primary" @click="upload" :loading="loadingStatus" class="submit_btn">
          {{ loadingStatus ? '上传中' : '点击上传' }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data: function () {
      return {
        loading: false,
        isTrue: true,
        columns1: [
          {
            width: 100,
            align: "center",
            title: '序号',
            key: 'name'
          },
          {
            align: "center",
            title: '类型',
            key: 'age'
          },
          {
            align: "center",
            title: '操作',
            render: function (h, params) {
              return h("a", {
                attrs: {
                  href: params.row.source,
                  target: "_Blank"
                }
              }, "下载")
            }
          }
        ],
        data1: [
          {
            name: '1',
            age: "学分批量导入模板",
            source: "../template/学分批量导入模板.xlsx"
          }
        ],
        excelPath: "",//上传到服务器上的excel文件路径
        uploadUrl: window.getHost + "upload/excel",
        remarkes: "",
        file: null,
        loadingStatus: false
      }
    },
    methods: {
      handleError: function (error, file, fileList) {
        this.$Message.error('选择文件失败')
        this.excelPath = "";
      },
      handleSuccess: function (response, file, fileList) {
        this.excelPath = response.data.excelPath;
        this.$Message.success('已选择' + file.name + '文件');
      },
      upload: function () {
        var that = this;
        if (this.excelPath == "") {
          this.$Message.error('请先选择文件')
          return false;
        }
        this.loadingStatus = true;
        this.$http.post(window.getHost + "money/importExcel", {
          excelPath: that.excelPath,
          content: that.remarkes
        }, {emulateJSON: true}).then(function (data) {
          that.$Message.success(data.data.msg)
          if (data.data.status == 200) {
            /*this.$http.post(window.getHost + "money/download/errorExcel", {
             excelPath: that.excelPath
             }, {emulateJSON: true}).then(function (data) {
             console.log(data);
             })*/
            /*下载start*/
            var elemIF = document.createElement("iframe");
            elemIF.id = "downLoadIframe";
            elemIF.src = window.getHost + "money/download/errorExcel?excelPath=" + that.excelPath;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
            setTimeout(function () {
              document.getElementById("downLoadIframe").parentNode.removeChild(document.getElementById("downLoadIframe"));
            }, 500)
            /*window.open(window.getHost + "money/download/errorExcel?excelPath="+that.excelPath);*/
          }
          that.loadingStatus = false;
          that.excelPath = "";
          that.remarkes = "";
          return false;
        }, function () {
          that.remarkes = "";
          that.loadingStatus = false;
          that.$Message.error("导入失败")
          return false;
        })
      }
    },
    components: {}
  }
</script>
