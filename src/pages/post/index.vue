<template>
  <div class="post">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <FormItem label="帖子ID" prop="id">
        <Input v-model="formSearch.id" style="width:150px" placeholder="帖子ID" size="small"></Input>
      </FormItem>
      <!-- <FormItem label="发帖人" prop="postMan">
        <Input v-model="formSearch.postMan" style="width:150px" placeholder="账号/昵称" size="small"></Input>
      </FormItem>
      <FormItem label="群组名称" prop="groupName">
        <Input v-model="formSearch.groupName" placeholder="群组名称" size="small"></Input>
      </FormItem>
      <FormItem label="帖子类型" prop="type">
        <Select v-model="formSearch.type"  size="small" placeholder="请选择" style="width: 90px;" clearable>
          <Option value="1">谈天说地</Option>
          <Option value="2">商务合作</Option>
          <Option value="3">互助平台</Option>
          <Option value="4">话题投票</Option>
          <Option value="5">话题</Option>
        </Select>
      </FormItem>
      <FormItem label="帖子状态" prop="lockStatus">
        <Select v-model="formSearch.lockStatus" placeholder="请选择" size="small" style="width: 80px;" clearable>
          <Option value="1">正常</Option>
          <Option value="2">屏蔽</Option>
        </Select>
      </FormItem>
      <FormItem label="发布时间">
        <FormItem prop="createdateStart">
          <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateStart" size="small" :clearable="false"></DatePicker>
        </FormItem>
        <FormItem>至</FormItem>
        <FormItem prop="createdateEnd">
          <DatePicker type="datetime" placeholder="点击选择时间" v-model="formSearch.createdateEnd" size="small" :clearable="false"></DatePicker>
        </FormItem>
      </FormItem> -->
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
        <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
          <Row>
            <Col span="12">
              <FormItem label="用户ID" prop="userId">
                <Input type="text" v-model="formDialog.userId" placeholder="请输入用户ID">
                </Input>
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="帖子状态" prop="postStatus">
                <Select v-model="formDialog.postStatus" placeholder="请选择"  clearable>
                  <Option v-for="item in postStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="帖子内容" prop="postContent">
                <Input type="textarea" :rows="4" v-model="formDialog.postContent" placeholder="请输入帖子内容">
                </Input>
              </FormItem>
            </Col>
          </Row>
          <!-- 上传图片 -->
          <Row>
            <Col span="24">
              <FormItem label="广告图片" prop="imagePath">
                <Row>
                  <Col span="6">
                    <Upload name="file"
                        :action="url.upload"
                        multiple
                        :before-upload="myBeforeUpload"
                        :format="['jpg','jpeg','png','gif','mp4']"
                        :on-format-error="handleFormatError"
                        :max-size="20000"
                        :on-exceeded-size="handleMaxSize"
                        :on-success="myHandleSuccess">
                      <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                    </Upload>
                    <Button type="primary" @click="myUpload" :loading="uploadLoading">上传图片</Button>
                  </Col>
                  <Col span="18">
                    <Row v-if="fileUrl.length">
                      <Col span="8" v-for="(item, index) in fileUrl" :key="item">
                        <div class="image-box">
                          <video :src="item" v-if="isVideo(item)" controls="controls" @click="toggle(index)"></video>
                          <img :src="item" v-else class="ad-img">
                          <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(index)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(index)"></Icon>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div v-show="!fileUrl.length" class="image-box">
                      <img src="static/images/img-upload-default.png" class="ad-img">
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
          <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
        </div>
    </Modal>
    <!-- 预览 -->
    <Modal v-model="noteDetailModal" title="预览" width="1000">
      <Row>
        <Col span="4" class="rightt"><strong>贴子内容:</strong></Col>
        <Col span="19"><p>{{look_data.postContent}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>用户ID:</strong></Col>
        <Col span="19" ><p>{{look_data.userId}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>帖子状态:</strong></Col>
        <Col span="19" ><p>{{look_data.postStatus}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>创建时间:</strong></Col>
        <Col span="19" ><p>{{look_data.createTime}}</p></Col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large"  :loading="modal_loading" @click="noteDetailModal = false">关闭</Button>
      </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  import axios from 'axios'
  export default {
    name: 'post_index',
    components: {
      mainTable,
      paging
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'post/add',
          edit: 'post/update',
          delete: 'post/delete',
          search: 'post/dataSearch',
          upload: 'api/fwmp/api/file/',
          sId: 'id/id',
        },
        pager: {
          data: [],
          url: 'post/dataGrid',
          method: 'post',
          current: 1,
          size: 10,
          // sort: 'createTime',
          // order: 'desc'
        },
        needId: true,
        noteDetailModal: false,
        modal_loading: false,
        uploadLoading: false,
        look_data:{
          postContent: '',
          userId: '',
          postStatus: '',
          createTime: '',
            // type:0,  //  1 谈天说地 2 商圈 3 帮衬 4 意见
            // comment:"",
            // createTime:'',
            // images:[],
            // businessStatus:0,
            // radioOrCheck:0,
        },
        postStatus: [
          {
            value: '0',
            label: '正常'
          },
          {
            value: '1',
            label: '已删除'
          }
        ],
        postStatusMap: {
          "0": "正常",
          "1": "已删除"
        },
        fileUrl: [],
        uploadImgArr: [],
        formSearch: {
          id: '',
          // groupName:'',
          // postMan: '',
          // type: '',
          // lockStatus: '',
          // createdateStart: '',
          // createdateEnd: ''
        },
        formDialog: {
          id: '',
          postContent: '',
          userId: '441528056573952',
          postStatus: '',
          createTime: '',
          imagePath: [],
          // appId:'',
          // nickName:'',
          // comment:'',
          // upvoteNum:'',
          // commentNum:'',
          // shareNum:'',
          // status:'',
          // image:''
        },
        columns: [
          {
            "title": "ID",
            "key": "id",
            "width": 180,
            "sortable": true,
            "fixed": "left"
          },
          {
            'title': '用户ID',
            'key': 'userId',
            // 'width': 150,
            'sortable': true
          },
          {
            'title': '帖子状态',
            'key': 'postStatus',
            // 'width': 150,
            'sortable': true
          },
          {
            'title': '创建时间',
            'key': 'createTime',
            // 'width': 150,
            'sortable': true
          },
          {
            'title': '帖子内容',
            'key': 'postContent',
            // 'width': 150,
            'sortable': true
          },
          {
            'title': '帖子图片',
            'key': 'imagePath',
            'sortable': true
          },
          {
            'title': '操作',
            'key': 'action',
            'width': 200,
            'align': 'center',
            'fixed': 'right',
            render: (create, params) => {
              let vm = this
              var btn_text = params.row.lockStatus==1?'屏蔽':'取消屏蔽'
              return create('div', [
                create('Button', {
                  props: { type: 'primary', size: 'small' },
                  style: { marginRight: '5px' },
                  on: {
                    click: function () {
                      var look_data = {}
                      for(var key in vm.look_data){
                        if(key=='postStatus'){
                          look_data[key] = vm.postStatusMap[params.row[key].toString()]
                        }else{
                          look_data[key] = params.row[key]
                        }
                      }
                      vm.look_data = look_data
                      vm.noteDetailModal = true
                    }
                  }
                }, '预览'),
                create('Button', {
                  props: {type: 'warning', size: 'small'},
                  style: {marginRight: '5px'},
                  on: {
                    click: function () {
                      vm.$Message.info(vm.label.wait)
                    }
                  }
                }, btn_text),
                vm.createDelBtn(create, params.row.id)
              ])
            }
          }
        ],
        rules: {}
      }
    },
    methods: {
      myBeforeUpload(file){
        var vm = this;
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          vm.fileUrl.push(reader.result)
          vm.uploadImgArr.push(file)
        }
        return false
      },
      handleFormatError(){
        this.$Message.error('文件格式错误，请选择jpg、jpeg、png或gif格式的文件！')
      },
      myHandleSuccess(){},
      handleView(index){},
      handleRemove(index){
        console.log('删除index: ',index)
        var vm = this
        vm.fileUrl.splice(index,1)
      },
      myUpload(){
        var vm = this
        if(!vm.uploadImgArr.length){
          vm.$Message.error('请先选择上传的图片')
          return
        }
        if(!vm.formDialog.userId){
          vm.$Message.error('请先选择发帖用户')
          return
        }
        vm.uploadLoading = true;
        vm.$http.post(vm.url.sId).then(res=>{
          var resData = res.data
          if(resData.code==1){
            var sId = resData.data;
            vm.formDialog.id = sId;
            let params = new FormData();
            vm.uploadImgArr.forEach(file =>{
              params.append('file', file)
            });
            params.append('sId',sId)
            // s   1  用户  2  帖子  3  广告
            params.append('s',2)
            // 使用位置 1：用户头像 2：帖子列表 3：帖子回复 4:创建群头像 5:编辑群头像
            params.append('p',2)
            var config =  {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            };
            var url = vm.url.upload + vm.formDialog.userId;
            axios.post(url, params, config).then(res=>{
              let rd = res.data;
              if(rd.code==1){
                // 清空已上传数组
                vm.uploadLoading = false;
                vm.uploadImgArr = [];
                vm.$Message.success('上传成功！');
                for(let key in rd.data){
                  vm.formDialog.imagePath.push(rd.data[key]);
                }
              }else{
                vm.$Message.error(rd.message)
              }
            }).catch(err=>{})
          }
        }).catch(err=>{})
      },
      handleMaxSize(){
        this.$Message.error('请选择小于20000KB的文件')
      },
      isVideo(fileUrl){
        var str = ('' + fileUrl).split('base64')[0];
        var isVideo = false
        if(str.indexOf('.mp4') != -1){
          isVideo = true
        }
        return isVideo
      },

      initDialog (data) {
        let _data = util.extend(data)
        this.provinceCity = [_data.cityCode.toString().slice(0, 2) + '0000', _data.cityCode.toString().slice(0, 4) + '00', _data.cityCode.toString()]
      },
      resetSearch (name) {
        let vm = this
        vm.derail_address_obj_s = []
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      resetDialogForm (name) {
        name = name || 'formDialog'
        let vm = this
        vm.fileUrl = []
        vm.uploadImgArr = []
        vm.uploadLoading = false;
        vm.dialogSubmitLoading = false;
        vm.$refs[name].resetFields()
      },
      initData () {
        let vm = this        
      }
    }
  }
</script>

<style scoped>
  .rightt{
    text-align: right;
    padding-right: 20px;
    font-size: 120%;
  }
  .image-box{
    position: relative;
    width:102px;
    height:102px;
    margin-bottom: 10px;
    border:1px solid #eee;
    text-align: center;
  }
  .ad-img{
    max-width: 100px;
    max-height: 100px;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    padding-top: 40px;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .image-box:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
