<template>
  <div class="user">
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
        <FormItem label="用户">
            <Input v-model="formSearch.name" placeholder="用户名/账号/手机号" size="small"></Input>
        </FormItem>
        <!-- <FormItem label="管理区域">
            <Cascader :data="derail_address_arr" v-model="derail_address_obj_s" filterable size="small" style="margin-top: 5px"></Cascader>
        </FormItem>
        <FormItem label="创建时间">
            <FormItem prop="createdateStart">
                <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateStart" size="small" :clearable="false"></DatePicker>
            </FormItem>
            <FormItem>至</FormItem>
            <FormItem prop="createdateEnd">
                <DatePicker type="datetime" placeholder="点击选择时间" style="width: 160px;" v-model="formSearch.createdateEnd" size="small" :clearable="false"></DatePicker>
            </FormItem>
        </FormItem> -->
        <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
        <Button type="primary" style="margin: 5px 8px 24px 0;" @click="postAddRow" size="small">发帖</Button>
    </Form>
    <!-- 用户数据展示表格 -->
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <!-- 添加/编辑用户弹窗 -->
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="750" @on-cancel="resetDialogForm('formDialog')">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="85">
        <Row v-if="currDialog=='add'">
          <Col span="12">
            <FormItem label="账号" prop="loginUsername">
              <Input v-model="formDialog.loginUsername" placeholder="请输入账号"></Input>
            </FormItem>
          </Col>
          <Col span="12" >
            <FormItem label="密码" prop="loginPassword">
              <Input v-model="loginPassword" placeholder="请输入密码" type="password"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="昵称" prop="nickName">
                <Input v-model="formDialog.nickName" placeholder="请输入昵称"></Input>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="用户状态" prop="userStatus">
                <Select v-model="formDialog.userStatus">
                  <Option v-for="item in userStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="性别" prop="sex">
                <Select v-model="formDialog.sex">
                    <Option v-for="item in sex" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
          <!-- <Col span="12">
              <FormItem label="电话" prop="phone">
                <Input v-model="formDialog.phone"></Input>
              </FormItem>
          </Col> -->
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="出生日期" prop="birthday">
              <DatePicker type="date" placeholder="点击选择出生日期" @on-change="birthChange" v-model="birthday" :clearable="false"></DatePicker>
            </FormItem>
          </Col>
           <Col span="12">
            <FormItem label="年龄" prop="age">
              <Input v-model="formDialog.age"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="头像" prop="headPortrait">
              <!-- <Input v-model="formDialog.headPortrait"></Input> -->
              <Row>
                <Col span="12">
                  <Upload name="file"
                      :action="url.upload"
                      :before-upload="myBeforeUpload"
                      :format="['jpg','jpeg','png','gif']"
                      :on-format-error="handleFormatError"
                      :max-size="3000"
                      :on-exceeded-size="handleMaxSize">
                    <Button type="ghost" icon="ios-cloud-upload-outline">选择头像</Button>
                  </Upload>
                  <Button type="primary" @click="myUpload" :loading="uploadLoading">上传头像</Button>
                </Col>
                <Col span="12">
                  <Row v-if="fileUrl.length">
                    <Col span="8" v-for="(item, index) in fileUrl" :key="item">
                      <div class="image-box">
                        <img :src="item" class="ad-img">
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
          <Col span="12">
            <FormItem label="头像背景" prop="bgPortrait">
              <!-- <Input v-model="formDialog.bgPortrait"></Input> -->
              <Row>
                <Col span="12">
                  <Upload name="file"
                      :action="url.upload"
                      :before-upload="myBeforeUpload2"
                      :format="['jpg','jpeg','png','gif']"
                      :on-format-error="handleFormatError2"
                      :max-size="3000"
                      :on-exceeded-size="handleMaxSize2">
                    <Button type="ghost" icon="ios-cloud-upload-outline">选择头像</Button>
                  </Upload>
                  <Button type="primary" @click="myUpload2" :loading="uploadLoading2">上传头像</Button>
                </Col>
                <Col span="12">
                  <Row v-if="fileUrl2.length">
                    <Col span="8" v-for="(item, index) in fileUrl2" :key="item">
                      <div class="image-box">
                        <img :src="item" class="ad-img">
                        <div class="demo-upload-list-cover">
                          <Icon type="ios-eye-outline" @click.native="handleView2(index)"></Icon>
                          <Icon type="ios-trash-outline" @click.native="handleRemove2(index)"></Icon>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <div v-show="!fileUrl2.length" class="image-box">
                    <img src="static/images/img-upload-default.png" class="ad-img">
                  </div>
                </Col>
              </Row>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="所在地">
              <Cascader :data="derail_address_arr" v-model="location_address" filterable></Cascader>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="家乡">
              <Cascader :data="derail_address_arr" v-model="hometown_address" filterable></Cascader>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="是否完善资料" prop="isConsummate">
              <Select v-model="formDialog.isConsummate">
                  <Option v-for="item in isConsummate" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="是否认证" prop="isAuth">
              <Select v-model="formDialog.isAuth">
                  <Option v-for="item in isAuth" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button v-if="currDialog=='add'" @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
    <!-- 预览用户数据 -->
    <Modal v-model="previewShow" title="预览" width="800">
      <Row>
        <Col span="4" class="rightt"><strong>账号:</strong></Col>
        <Col span="19"><p>{{previewData.loginUsername}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>用户昵称:</strong></Col>
        <Col span="19" ><p>{{previewData.nickName}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>appSoucre:</strong></Col>
        <Col span="19" ><p>{{appSoucreMap[previewData.appSoucre]}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>出生日期:</strong></Col>
        <Col span="19" ><p>{{previewData.birthday}}</p></Col>
      </Row>

      <Row>
        <Col span="4" class="rightt"><strong>年龄:</strong></Col>
        <Col span="19" ><p>{{previewData.age}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>性别:</strong></Col>
        <Col span="19" ><p>{{sexMap[previewData.sex]}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>用户头像:</strong></Col>
        <Col span="19" >
          <div class="preview-img-box">
            <img :src="previewData.headPortrait" :alt="previewData.headPortrait">
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>头像背景:</strong></Col>
        <Col span="19" >
          <div class="preview-img-box">
            <img :src="previewData.bgPortrait" :alt="previewData.bgPortrait">
          </div>
        </Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>所在地:</strong></Col>
        <Col span="19" ><p>{{previewData.location}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>家乡:</strong></Col>
        <Col span="19" ><p>{{previewData.home}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>是否认证:</strong></Col>
        <Col span="19" ><p>{{isAuthMap[previewData.isAuth]}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>是否完善资料:</strong></Col>
        <Col span="19" ><p>{{isConsummateMap[previewData.isConsummate]}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>用户状态:</strong></Col>
        <Col span="19" ><p>{{userStatusMap[previewData.userStatus]}}</p></Col>
      </Row>
      <Row>
        <Col span="4" class="rightt"><strong>创建时间:</strong></Col>
        <Col span="19" ><p>{{previewData.createTime}}</p></Col>
      </Row>
      <div slot="footer">
        <Button type="primary" size="large"  @click="previewShow = false">关闭</Button>
      </div>
    </Modal>
    <!-- 根据userId获取的帖子数据 -->
    <Modal v-model="postShow" title="帖子" width="1000">
      <mainTable :columns="postColumns" :data="postPager.data"></mainTable>
      <paging @changePager="postChangePager" @paging="postPaging" :total="postPager.total" :currPage="postPager.currPage"></paging>
      <div slot="footer">
        <Button type="primary" size="large"  @click="postShow = false">关闭</Button>
      </div>
    </Modal>
    <!-- 当前用户发帖 -->
    <Modal v-model="postDialogShow" :title="label[postCurrDialog] + '帖子'" :mask-closable="false" width="750" @on-cancel="postResetDialogForm('postFormDialog')">
        <Form :model="postFormDialog" ref="postFormDialog" :rules="rules" :label-width="80">
          <Row>
            <Col span="12">
              <FormItem label="用户ID" prop="userId">
                <Input v-model="postFormDialog.userId" placeholder="请输入用户ID"></Input>
                <!-- <Select v-model="postFormDialog.userId" placeholder="请选择" clearable>
                  <Option v-for="item in userId" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select> -->
              </FormItem>
            </Col>
            <Col span="12">
              <FormItem label="帖子状态" prop="postStatus">
                <Select v-model="postFormDialog.postStatus" placeholder="请选择"  clearable>
                  <Option v-for="item in postStatus" :value="item.value" :key="item.value">{{ item.label }}</Option>
                </Select>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span="24">
              <FormItem label="帖子内容" prop="postContent">
                <Input type="textarea" :rows="4" v-model="postFormDialog.postContent" placeholder="请输入帖子内容"></Input>
              </FormItem>
            </Col>
          </Row>
          <!-- 上传图片 -->
          <Row>
            <Col span="24">
              <FormItem label="图片/视频">
                <Row>
                  <Col span="6">
                    <Upload name="file"
                        :action="url.upload"
                        multiple
                        :before-upload="myBeforeUpload3"
                        :format="['jpg','jpeg','png','gif','mp4']"
                        :on-format-error="handleFormatError3"
                        :max-size="20000"
                        :on-exceeded-size="handleMaxSize3">
                      <Button type="ghost" icon="ios-cloud-upload-outline">选择文件</Button>
                    </Upload>
                    <Button type="primary" @click="myUpload3" :loading="uploadLoading3">确定上传</Button>
                  </Col>
                  <Col span="18">
                    <Row v-if="fileUrl3.length">
                      <Col span="8" v-for="(item, index) in fileUrl3" :key="item">
                        <div class="image-box">
                          <video :src="item" v-if="isVideo(item)" controls="controls" @click="toggle(index)"></video>
                          <img :src="item" v-else class="ad-img">
                          <div class="demo-upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView3(index)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove3(index)"></Icon>
                          </div>
                        </div>
                      </Col>
                    </Row>
                    <div v-show="!fileUrl3.length" class="image-box">
                      <img src="static/images/img-upload-default.png" class="ad-img">
                    </div>
                  </Col>
                </Row>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div slot="footer">
          <Button @click="postResetDialogForm('postFormDialog')">{{label.clear}}</Button>
          <Button type="primary" @click="postSubmitDialogForm('postFormDialog')" :loading="postDialogSubmitLoading">{{label.submit}}</Button>
        </div>
    </Modal>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  export default {
    name: 'user',
    components: {
      mainTable,
      paging
    },
    mixins: [page],
    data () {
      return {
        url: {
          add: 'user/add',
          edit: 'user/update',
          delete: 'user/delete',
          search: 'user/dataSearch',
          upload: 'file/',
          sId: 'id/id',
          post: 'post/search/userId/',
          postAdd: 'post/add'
        },
        userId: [],
        pager: {
          data: [],
          url: 'user/dataGrid',
        },
        postCurrDialog: 'add',
        postShow: false,
        postPager: {
          data: [],
          url: '',
          method: 'post',
          current: 1,
          size: 10,
          total: 0
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
        postColumns: [
          {
            "title": "ID",
            "key": "id",
            "width": 180,
            "sortable": true,
            "fixed": "left"
          },
          {
            "title": "用户ID",
            "key": "userId",
            "width": 180,
            "sortable": true,
          },
          // {
          //   'title': '收藏数量',
          //   'key': 'postCollectionCount',
          //   'width': 120,
          //   'sortable': true
          // },
          // {
          //   'title': '评论数量',
          //   'key': 'postCommentsCount',
          //   'width': 120,
          //   'sortable': true
          // },
          // {
          //   'title': '点赞数量',
          //   'key': 'postThumbCount',
          //   'width': 120,
          //   'sortable': true
          // },
          // {
          //   'title': '转发数量',
          //   'key': 'postTransmitCount',
          //   'width': 120,
          //   'sortable': true
          // },
          // {
          //   'title': '是否认证',
          //   'key': 'userIsAuth',
          //   'width': 150,
          //   'sortable': true,
          //   render: (create, params) => {
          //     return create('span', this.isAuthMap[params.row.userIsAuth.toString()]);
          //   }
          // },
          // {
          //   'title': '昵称',
          //   'key': 'userNickName',
          //   'width': 150,
          //   'sortable': true
          // },
          // {
          //   'title': '性别',
          //   'key': 'userSex',
          //   'width': 150,
          //   'sortable': true,
          //   render: (create, params) => {
          //     return create('span',this.sexMap[params.row.userSex])
          //   }
          // },
          {
            'title': '帖子状态',
            'key': 'postStatus',
            'width': 150,
            'sortable': true,
            render: (create, params) => {
              return create('span',this.postStatusMap[params.row.postStatus])
            }
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
            'width': 250,
            'ellipsis': true,
            'sortable': true
          },
          // {
          //   'title': '用户头像',
          //   'key': 'userheadPortrait',
          //   'width': 250,
          //   'sortable': true,
          //   render: function (create, params) {
          //     return create('img', {
          //       attrs: {
          //         src: params.row.userheadPortrait
          //       },
          //       style: {
          //         'border': '1px solid transparent',
          //         'border-radius': '4px',
          //         'margin': '10px 0',
          //         'max-width': '100px',
          //         'max-height': '100px'
          //       }
          //     })
          //   }
          // },
          // {
          //   'title': '帖子图片',
          //   'key': 'fileManageList',
          //   'width': 250,
          //   'sortable': true,
          //   render(create,params){
          //     return create('span','图片数据')
          //   }
          // },
        ],
        needId: true,
        postDialogShow: false,
        previewShow: false,
        uploadLoading: false,
        uploadLoading2: false,
        uploadLoading3: false,
        postDialogSubmitLoading: false,
        // 头像
        fileUrl: [],
        uploadImgArr: [],
        // 头像背景
        fileUrl2: [],
        uploadImgArr2: [],
        // 帖子
        fileUrl3: [],
        uploadImgArr3: [],
        derail_address_arr: [],
        derail_address_obj_s: [],
        hometown_address: [], // 家乡
        location_address: [], //  所在地
        chinaJson: {},
        appSoucreMap: {
          "1": 'IOS',
          "2": "Android",
          "3": "Web"
        },
        userStatus: [{label:'正常', value:'1'}, {label:"禁用", value:'2'}, {label:"封号", value:'3'}],
        userStatusMap: {
          "1": "正常",
          "2": "禁用",
          "3": "封号"
        },
        isAuth: [{label:'否', value:'0'}, {label:"是", value:'1'}],
        isAuthMap: {
          '0': '否',
          '1': '是',
        },
        isConsummate: [{label:'否', value:'0'}, {label:"是", value:'1'}],
        isConsummateMap: {
          '0': '否',
          '1': '是',
        },
        sex: [{label:'男', value:'1'}, {label:"女", value:'0'}],
        sexMap: {
          '0': '女',
          '1': '男',
          '': '保密'
        },
        imageHost: sessionStorage.imageHost || '',
        formSearch: {
          name: '',
          // createdateStart: '',
          // createdateEnd: '',
          // areaCode: ''
        },
        birthday: '',
        loginPassword: '',
        previewData: {},
        formDialog: {
          id: '',
          loginUsername: '',
          loginPassword: '',
          nickName: '',
          birthday: '',
          age: '',
          sex: '',
          appSoucre: '3', // 后台管理系统添加的用户appSource永远为3，为了和ios和安卓用户区分
          bgPortrait: '',
          headPortrait: '',
          provincesCode: '',
          cityCode: '',
          areaCode: '',
          homeProvincesCode: '',
          homeCityCode: '',
          homeAreaCode: '',
          isAuth: '',
          isConsummate: '',
          userStatus: '1',
          createTime: '',
        },
        postFormDialog: {
          id: '',
          userId: '',
          postStatus: '0',
          postContent: '',
          imagePath: [],
        },
        columns: [
          {
            "type": 'selection',
            "fixed": 'left',
            "width": 80,
            "align": 'center'
          },
          {
            "title": "ID",
            "key": "id",
            "width": 200,
            "sortable": true
          },
          {
            "title": "账号",
            "key": "loginUsername",
            "width": 150,
            "sortable": true
          },
          {
            "title": "用户昵称",
            "key": "nickName",
            "width": 150,
            "sortable": true
          },
          {
            "title": "appSoucre",
            "key": "appSoucre",
            "width": 150,
            "sortable": true,
            render:(create,params)=>{
              var appSoucre = params.row.appSoucre ? params.row.appSoucre : ''
              return create('span',this.appSoucreMap[appSoucre])
            }
          },
          {
            "title": "出生日期",
            "key": "birthday",
            "width": 240,
            "sortable": true
          },
          // {
          //   "title": "电话",
          //   "key": "phone",
          //   "width": 240,
          //   "sortable": true
          // },
          {
            "title": "年龄",
            "key": "age",
            "width": 80,
            "sortable": true
          },
          {
            "title": "性别",
            "key": "sex",
            "width": 80,
            "sortable": true,
            render: (create, params) => {
              var txt = this.sexMap[params.row.sex]
              return create('span',txt)
            }
          },
          {
            "title": "用户头像",
            "key": "headPortrait",
            "width": 240,
            "sortable": true,
            render: function (create, params) {
              return create('img', {
                attrs: {
                  src: params.row.headPortrait
                },
                style: {
                  'border': '1px solid transparent',
                  'border-radius': '4px',
                  'margin': '10px 0',
                  'max-width': '100px',
                  'max-height': '100px'
                }
              })
            }
          },
          {
            "title": "头像背景",
            "key": "bgPortrait",
            "width": 240,
            "sortable": true,
            render: function (create, params) {
              return create('img', {
                attrs: {
                  src: params.row.bgPortrait
                },
                style: {
                  'border': '1px solid transparent',
                  'border-radius': '4px',
                  'margin': '10px 0',
                  'max-width': '100px',
                  'max-height': '100px'
                }
              })
            }
          },
          {
            "title": "省",
            "key": "provincesCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "市",
            "key": "cityCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "区",
            "key": "areaCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "家乡省",
            "key": "homeProvincesCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "家乡市",
            "key": "homeCityCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "家乡区",
            "key": "homeAreaCode",
            "width": 100,
            "sortable": true
          },
          {
            "title": "是否认证",
            "key": "isAuth",
            "width": 150,
            "sortable": true,
            render: (create, params) => {
              var status = params.row.isAuth ? params.row.isAuth.toString() : '';
              return create('span', this.isAuthMap[status]);
            }
          },
          {
            "title": "是否完成资料",
            "key": "isConsummate",
            "width": 150,
            "sortable": true,
            render: (create, params) => {
              var status = params.row.isConsummate ? params.row.isConsummate.toString() : '';
              return create('span', this.isConsummateMap[status]);
            }
          },
          {
            "title": "状态",
            "key": "userStatus",
            "width": 100,
            "sortable": true,
            render: (create, params) => {
              var status = params.row.userStatus ? params.row.userStatus.toString() : '';
              return create('span', this.userStatusMap[status]);
            }
          },
          {
            "title": "创建时间",
            "key": "createTime",
            "width": 200,
            "sortable": true
          },
          {
            title: '操作',
            key: 'action',
            width: 250,
            align: 'center',
            fixed: 'right',
            render: (create, params) => {
              let vm = this
              var arr = [vm.createPreviewBtn(create, params.row), vm.createPostBtn(create,params.row.id), vm.createEditBtn(create, params.row)]
              if(params.row.appSoucre=='3'){
                arr.push(vm.createDelBtn(create, params.row.id))
              }
              return create('div',arr)
            }
          }
        ],
        rules: {
          loginUsername: [
            { required: true, message: '登录名称不能为空', trigger: 'blur' },
            { type: 'string', min: 4, max: 64, message: '登录名须在4-64个字符之间', trigger: 'blur' }
          ],
          nickName: [
            { required: true, message: '姓名不能为空', trigger: 'blur' }
          ],
          loginPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' }
          ],
          // userStatus: [
          //   { required: true, message: '用户状态不能为空', trigger: 'change' }
          // ],
          // userType: [
          //   { required: true, message: '用户类型不能为空', trigger: 'change' }
          // ],
          // sex: [
          //   { required: true, message: '用户性别不能为空', trigger: 'change' }
          // ],
          // detailAddress: [
          //   { required: true, message: '请选择关联地区', trigger: 'change' }
          // ],
          // phone : [
          //   { required: true, message: '联系方式不能为空', trigger: 'change' },
          // ]
        }
      }
    },
    methods: {
      // 发帖按钮
      postAddRow(){
        var vm = this
        vm.postCurrDialog = 'add'
        vm.postDialogShow = true
      },

      // 创建预览按钮
      createPreviewBtn(create,rowData){
        var vm = this;
        return create('Button',{
          props: {
            type: 'primary',
            size: 'small'
          },
          style: {
            'margin-right': '5px'
          },
          on: {
            click(){
              var previewData = {};
              for(var key in rowData){
                previewData[key] = rowData[key]
              }
              var provincesCode = rowData.provincesCode,
                  cityCode = rowData.cityCode,
                  areaCode = rowData.areaCode,
                  homeProvincesCode = rowData.homeProvincesCode,
                  homeCityCode = rowData.homeCityCode,
                  homeAreaCode = rowData.homeAreaCode;
              previewData.location = vm.util.getProvinceCityArea([provincesCode,cityCode,areaCode], vm.chinaJson, true)
              previewData.home = vm.util.getProvinceCityArea([homeProvincesCode,homeCityCode,homeAreaCode], vm.chinaJson, true)
              vm.previewData = previewData
              vm.previewShow = true
            }
          }
        },'预览')
      },
      // 查看用户帖子按钮
      createPostBtn(create, userId){
        var vm = this;
        return create('Button',{
          props: {
            type: 'primary',
            size: 'small',
            // loading: false // 绑定上传loading效果
          },
          style: {
            'margin-right': '5px'
          },
          on: {
            click(){
              vm.initPostData(userId)
            }
          }
        },'查看帖子')
      },
      initPostData(userId){
        var vm = this;
        if(!userId){
          vm.$Message.error('用户ID获取失败')
          return
        }
        vm.postShow = true
        vm.postPager.url = vm.url.post + userId
        vm.postPaging()
      },
      postChangePager(data){
        let vm = this
        if (typeof data === 'object') {
          for (let key in data) {
            vm.postPager[key] = data[key]
          }
        } else {
          vm.postPager.currPage = data
        }
        vm.postPaging()
      },
      postPaging(currPage,id){
        let vm = this
        if (currPage && Number(currPage)) {
          vm.changePager(currPage)
          return
        }
        vm.$http2({
          url: vm.postPager.url,
          method: vm.postPager.method,
          data: vm.pagingFiltData(vm.postPager)
        }).then(res => {
          let resData = res.data
          if (resData.code == 1) {
            if (typeof vm.postPagerResult == 'function') {
              // 返回数据预处理   为什么执行这个函数会导致下边的函数不执行
              // resData.data = vm.postPagerResult(resData.data)
            }
            setTimeout(function(){
              vm.postPager.data = resData.data
              vm.postPager.total = resData.total
            },50)
          } else{
            vm.$Message.error(resData.message)
          }
        }).catch(err=>{})
      },
      postPagerResult(data){
        var result = vm.util.deepcopy(data)
        var len = result.length,item;
        for(var i=0;i<len;i++){
          item = result[i]
          if(typeof item.createTime == 'number'){
            item.createTime = vm.util.timestampToTime(item.createTime);
          }
          if(typeof item.postStatus == 'number'){
            item.postStatus = item.postStatus.toString()
          }
        }
        return result
      },
      // 手动上传头像
      myBeforeUpload(file){
        var vm = this;
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          vm.fileUrl = [reader.result]
          vm.uploadImgArr = [file]
        }
        return false
      },
      handleFormatError(){},
      handleMaxSize(){},
      myUpload(){
        // 确认上传
        var vm = this
        if(!vm.uploadImgArr.length){
          vm.$Message.error('请先选择上传的图片')
          return
        }
        if(vm.currDialog=='add'){
          vm.$http.post(vm.url.sId).then(res=>{
            var resData = res.data
            if(resData.code==1){
              var sId = resData.data;
              vm.formDialog.id = sId;
              vm.uploadFile(sId)
            }
          }).catch(err=>{})
        }else{
          var sId = vm.formDialog.id
          vm.uploadFile(sId)
        }
      },
      uploadFile(sId){
        var vm = this;
        let params = new FormData();
        vm.uploadImgArr.forEach(file =>{
          params.append('file', file)
        });
        params.append('sId',sId)
        // s   1  用户  2  帖子  3  广告
        params.append('s',1)
        // 使用位置 1：用户头像 2：帖子列表 3：帖子回复 4:创建群头像 5:编辑群头像 
        params.append('p',1)
        var config =  {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        };
        vm.$http.post(vm.url.upload + sId, params, config).then(res=>{
          let rd = res.data;
          if(rd.code==1){
            // 清空已上传数组
            vm.uploadImgArr = [];
            vm.$Message.success('上传图片成功！');
            var arr = [rd.data[0]]
            vm.formDialog.headPortrait = arr[0] || '';
            vm.uploadLoading = false
          }else{
            vm.$Message.error(rd.message)
          }
        }).catch(err=>{})
      },
      handleView(index){},
      handleRemove(index){
        var vm = this
        vm.fileUrl.splice(index,1)
        vm.uploadImgArr.splice(index,1)
        vm.formDialog.headPortrait = ''
      },
      // 手动上传头像背景
      myBeforeUpload2(file){
        var vm = this;
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          vm.fileUrl2 = [reader.result]
          vm.uploadImgArr2 = [file]
        }
        return false
      },
      myUpload2(){
        var vm = this
        if(!vm.uploadImgArr2.length){
          vm.$Message.error('请先选择上传的图片')
          return
        }
        if(vm.currDialog=='add'){
          vm.$http.post(vm.url.sId).then(res=>{
            var resData = res.data
            if(resData.code==1){
              var sId = resData.data;
              vm.formDialog.id = sId;
              vm.uploadFile2(sId)
            }
          }).catch(err=>{})
        }else{
          var sId = vm.formDialog.id
          vm.uploadFile2(sId)
        }
      },
      handleFormatError2(){},
      handleMaxSize2(){},
      uploadFile2(sId){
        var vm = this;
        let params = new FormData();
        vm.uploadImgArr2.forEach(file =>{
          params.append('file', file)
        });
        params.append('sId',sId)
        // s   1  用户  2  帖子  3  广告
        params.append('s',1)
        // 使用位置 1：用户头像 2：帖子列表 3：帖子回复 4:创建群头像 5:编辑群头像 
        params.append('p',1)
        var config =  {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        };
        vm.$http.post(vm.url.upload + sId, params, config).then(res=>{
          let rd = res.data;
          if(rd.code==1){
            // 清空已上传数组
            vm.uploadImgArr2 = [];
            vm.$Message.success('上传图片成功！');
            var arr = [rd.data[0]]
            vm.formDialog.bgPortrait = arr[0] || '';
            vm.uploadLoading2 = false
          }else{
            vm.$Message.error(rd.message)
          }
        }).catch(err=>{})
      },
      handleView2(index){},
      handleRemove2(index){
        var vm = this
        vm.fileUrl2.splice(index,1)
        vm.uploadImgArr2.splice(index,1)
        vm.formDialog.bgPortrait = ''
      },
      // 发帖发图片/视频
      myBeforeUpload3(file){
        var vm = this;
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = function (e) {
          // todo 限制上传数量
          vm.fileUrl3.push(reader.result)
          vm.uploadImgArr3.push(file)
        }
        return false
      },
      handleFormatError3(){},
      handleMaxSize3(){},
      myUpload3(){
        // 确认上传
        var vm = this
        if(!vm.uploadImgArr3.length){
          vm.$Message.error('请先选择上传的图片')
          return
        }
        if(!vm.postFormDialog.userId){
          vm.$Message.error('请先选择发帖用户')
          return
        }
        vm.uploadLoading3 = true
        if(vm.postCurrDialog=='add'){
          vm.$http.post(vm.url.sId).then(res=>{
            var resData = res.data
            if(resData.code==1){
              var sId = resData.data;
              vm.postFormDialog.id = sId;
              vm.uploadFile3(sId)
            }
          }).catch(err=>{})
        }else{
          var sId = vm.postFormDialog.id
          vm.uploadFile(sId)
        }
      },
      uploadFile3(sId){
        var vm = this;
        let params = new FormData();
        vm.uploadImgArr3.forEach(file =>{
          params.append('file', file)
        });
        params.append('sId',sId)
        // s   1  用户  2  帖子  3  广告
        params.append('s',2)
        // 使用位置 1：用户头像 2：帖子列表 3：帖子回复 4:创建群头像 5:编辑群头像 
        params.append('p',1)
        var config =  {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
        };
        vm.$http.post(vm.url.upload + sId, params, config).then(res=>{
          let rd = res.data;
          if(rd.code==1){
            // 清空已上传数组
            vm.uploadImgArr3 = [];
            vm.$Message.success('上传成功！');
            var arr = []
            for(var key in rd.data){
              if(key=='server')continue
              arr.push(rd.data[key])
            }
            vm.postFormDialog.imagePath = arr
            vm.uploadLoading3 = false
          }else{
            vm.$Message.error(rd.message)
          }
        }).catch(err=>{})
      },
      handleView3(index){},
      handleRemove3(index){
        var vm = this
        vm.fileUrl3.splice(index,1)
        vm.uploadImgArr3.splice(index,1)
        vm.postFormDialog.imagePath.splice(index,1)
      },
      isVideo(fileUrl){
        var str = ('' + fileUrl).split('base64')[0];
        var isVideo = false
        if(str.indexOf('.mp4') != -1){
          isVideo = true
        }
        return isVideo
      },


      // getNoHostUrl(url,host){
      //   host = host || 'http://10.0.0.21:800/'
      //   var result = '' + url
      //   if(!result) return result
      //   var ind = url.indexOf(host)
      //   if(ind>-1){
      //     result = url.split(host)[1]
      //   }
      //   return result
      // },
      birthChange(date){
        var vm = this
        if(date.length){
          vm.formDialog.birthday = date + ' 00:00:00'
          var now = new Date();
          var arr = date.split('-');
          var year = now.getFullYear(),
              month = now.getMonth() + 1;
          var birthYear = Number(arr[0]),
              birthMonth = Number(arr[1]);
          var a = year-birthYear,
              b = month - birthMonth;
          vm.formDialog.age = b > 0 || b==0 ? a : a-1;
        }else{
          vm.formDialog.birthday = ''
          vm.formDialog.age = 0
        }
      },
      resetSearch (name) {
        let vm = this
        vm.derail_address_obj_s = []
        vm.formSearch.name = ''
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      postResetDialogForm(name){
        name = name || 'postFormDialog'
        var vm = this
        vm.fileUrl3 = []
        vm.uploadImgArr3 = []
        vm.postFormDialog.imagePath = []
      },
      postSubmitDialogForm(name){
        var vm = this
        vm.$refs[name].validate(function (valid) {
        if (valid) {
          let ajaxData = vm.postFormDialog
          let ajaxUrl = vm.url.postAdd
          vm.postDialogSubmitLoading = true
          vm.$http({
            url: ajaxUrl,
            method: vm.pager.method,
            data: ajaxData
          }).then(res => {
            vm.postDialogSubmitLoading = false
            var resData = res.data
            if(resData.code==1){
              vm.$Message.success('发帖成功!')
              vm.paging();
              vm.postDialogShow = false
              if(typeof vm.resetDialogForm == 'function'){
                vm.postResetDialogForm()
              }
            }else{
              vm.$Message.error('发帖失败: ' + resData.message)
            }
          }).catch(err=>{
    
          })
        }
      })
      },

      resetDialogForm (name) {
        name = name || 'formDialog'
        var vm = this;
        vm.formDialog.id=''
        vm.formDialog.birthday = ''
        vm.birthday = ''
        vm.location_address = []
        vm.hometown_address = []
        vm.fileUrl = []
        vm.uploadImgArr = []
        vm.fileUrl2 = []
        vm.uploadImgArr2 = []
        vm.formDialog.appSoucre = '3'
        vm.formDialog.loginUsername = ''
        vm.formDialog.loginPassword = ''
        vm.loginPassword = ''
        vm.$refs[name].resetFields()
      },
      initDialog (data) {
        var vm = this;
        if(typeof data.isAuth=='number'){
          data.isAuth = data.isAuth.toString()
        }
        if(typeof data.isConsummate=='number'){
          data.isConsummate = data.isConsummate.toString()
        }
        if(typeof data.appSoucre=='number'){
          data.appSoucre = data.appSoucre.toString()
        }
        if(typeof data.userStatus=='number'){
          data.userStatus = data.userStatus.toString()
        }
        if(typeof data.sex=='number'){
          data.sex = data.sex.toString()
        }
        var provincesCode = data.provincesCode,
            cityCode = data.cityCode,
            areaCode = data.areaCode,
            homeProvincesCode = data.homeProvincesCode,
            homeCityCode = data.homeCityCode,
            homeAreaCode = data.homeAreaCode;
        vm.hometown_address = [homeProvincesCode, homeCityCode, homeAreaCode]
        vm.location_address = [provincesCode, cityCode, areaCode]
        vm.fileUrl = [data.headPortrait]
        vm.fileUrl2 = [data.bgPortrait]
        vm.birthday = data.birthday
      },
      pagerResult(data){
        var userId = [];
        var item;
        for(let i=0;i<data.length;i++){
          item = data[i]
          userId.push({
            value: item.id,
            label: item.nickName
          })
        }
        console.log('userId: ',userId)
        // vm.userId = userId
        return data
      },
      initData () {
        var vm = this
        if(sessionStorage.chinaData){
          vm.derail_address_arr = JSON.parse(sessionStorage.chinaData)
          vm.chinaJson = JSON.parse(sessionStorage.chinaJson)
        }
      }
    },
    watch: {
      loginPassword(val){
        var vm = this
        if(vm.currDialog == 'add'){
          // 添加用户是进行md5加密，编辑时不用
          vm.formDialog.loginPassword = hex_md5(val)
        }else{
          vm.formDialog.loginPassword = val
        }
      },
      derail_address_obj_s (val) {
        if (val.length) {
          this.formSearch.areaCode = val[2]
        } else {
          this.formSearch.areaCode = ''
        }
      },
      hometown_address(val){
        var vm =this;
        if(val.length){
          vm.formDialog.provincesCode = val[0]
          vm.formDialog.cityCode = val[1]
          vm.formDialog.areaCode = val[2]
        }else{
          vm.formDialog.provincesCode = ''
          vm.formDialog.cityCode = ''
          vm.formDialog.areaCode = ''
        }
      },
      location_address(val){
        var vm =this;
        if(val.length){
          vm.formDialog.homeProvincesCode = val[0]
          vm.formDialog.homeCityCode = val[1]
          vm.formDialog.homeAreaCode = val[2]
        }else{
          vm.formDialog.homeProvincesCode = ''
          vm.formDialog.homeCityCode = ''
          vm.formDialog.homeAreaCode = ''
        }
      }
    },
  }
</script>
<style scoped>
.image-box{
  position: relative;
  width:102px;
  height:102px;
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
.preview-img-box{
  width: 100px;
  height: 100px;
  border: 1px solid gray;
}
.preview-img-box img{
  max-width: 100%;
  max-height: 100%;
}
</style>
