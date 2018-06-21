<template>
  <div class="push_article">
    推送分为：单人推送、区域推送、单平台推送、全平台推送
    <Form :model="formSearch" ref="formSearch" inline :label-width="60">
      <Button type="ghost" style="margin:5px 8px 24px 0;" @click="resetSearch('formSearch')" size="small">{{label.clear}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="submitSearch('formSearch')" size="small">{{label.search}}</Button>
      <Button type="primary" style="margin: 5px 8px 24px 0;" @click="addRow" size="small">{{label.add}}</Button>
    </Form>
    <mainTable :columns="columns" :data="pager.data"></mainTable>
    <paging @changePager="changePager" @paging="paging" :total="pager.total" :currPage="pager.currPage"></paging>
    <Modal v-model="dialogShow" :title="label[currDialog]" :mask-closable="false" width="1000" @on-cancel="resetDialogForm('formDialog')" :styles="{top:'30px'}">
      <Form :model="formDialog" ref="formDialog" :rules="rules" :label-width="80">
        <Row>
          <Col span="12">
            <FormItem label="推送类型" prop="pushType">
              <Select v-model="selectPushType" @on-change="pushTypeChange" placeholder="请选择推送类型"  clearable>
                <Option v-for="item in pushType" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col v-if="selectPushType==2" span="12">
            <FormItem label="推送区域" prop="pushArea">
              <Cascader :data="chinaData" v-model="pushArea" filterable></Cascader>
            </FormItem>
          </Col>
          <Col v-if="selectPushType==3" span="12">
            <FormItem label="推送平台" prop="pushPlatForm">
              <Select v-model="formDialog.pushPlatForm" placeholder="请选择推送类型"  clearable>
                <Option v-for="item in pushPlatForm" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row v-if="selectPushType==1">
          <Col span="12">
            <FormItem label="发送人" prop="sendUserId">
              <Select v-model="formDialog.sendUserId" placeholder="请选择/输入关键字搜索" filterable clearable>
                <Option v-for="item in allUser" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="12">
            <FormItem label="接收人" prop="receiveUserId">
              <Select v-model="formDialog.receiveUserId" placeholder="请选择/输入关键字搜索" filterable clearable>
                <Option v-for="item in allUser" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="12">
            <FormItem label="标题" prop="title">
              <Input v-model="formDialog.title" placeholder="请输入标题"></Input>
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span="24">
            <FormItem label="内容" prop="content">
              <!-- <vue2-editor></vue2-editor> -->
              <!-- <wang @updateContent="updateContent"></wang> -->
              <tinymce :id="tinymceId" @updateContent="updateContent" v-model="formDialog.sendContent"></tinymce>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <div slot="footer">
        <Button @click="resetDialogForm('formDialog')">{{label.clear}}</Button>
        <Button type="primary" @click="submitDialogForm('formDialog')" :loading="dialogSubmitLoading">{{label.submit}}</Button>
      </div>
    </Modal>
  </div>
</template>
<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  import page from '@/mixins/page'
  import tinymce from '@/components/tinymce'
  import vue2Editor from '@/components/vue2editor'
  import wang from '@/components/wang'
  export default {
    name: 'push_article',
    mixins: [page],
    components: {
      mainTable,
      paging,
      vue2Editor,
      wang,
      tinymce
    },
    data(){
      return {
        url: {
          add: 'web/push/sendOtoO',
          edit: '',
          delete: '',
          search: '',
          allUser: 'user/all/user',
        },
        pager: {
          url: '',
          data: [],
        },
        pushArea: [], //推送的区域
        tinymceId: 'push_article',
        wangId: 'article',
        allUser: [],
        allUserMap: {},
        selectPushType: '',
        pushType: [
          {
            value: '1',
            label: '单人推送'
          },
          {
            value: '2',
            label: '区域推送'
          },
          {
            value: '3',
            label: '单平台推送'
          },
          {
            value: '4',
            label: '全部推送'
          },
        ],
        pushPlatForm: [
          {
            value: 'android',
            label: '安卓'
          },
          {
            value: 'ios',
            label: '苹果'
          }
        ],
        chinaData: [],
        chinaJson: {},
        formSearch: {
          
        },
        formDialog: {
          pushPlatForm: '',
          sendUserId: '',
          receiveUserId: '',
          title: '',
          receiveUserId: '',
          receiveUserId: '',
          receiveUserId: '',
        },
        columns: [],
        rules: {
          pushType: [
            { required: true, message: '推送类型不能为空', trigger: 'blur' },
            // {
            //   validator(rule, value, callback, source, options) {
            //     var errors = [];
            //     if(!value){
            //       callback('推送类型不能为空');
            //     }
            //     callback(errors);
            //   }
            // }
          ],
          title: [
            { required: true, message: '标题不能为空', trigger: 'blur' },
          ]
        }
      }
    },
    methods: {
      resetSearch(name){
        name = name || 'formSearch'
        var vm = this
        vm.$refs[name].resetFields()
        vm.submitSearch(name)
      },
      resetDialogForm(name){
        name = name || 'formDialog'
        var vm = this
        vm.selectPushType = ''
        vm.setContent('')
        vm.$refs[name].resetFields()
      },
      pushTypeChange(type){
        console.log('type: ',type)
        if(type==1){

        }else if(type==2){

        }else if(type==3){
          
        }else if(type==4){
          
        }
      },
      setContent (content) {
        content = content || ''
        window.tinymce.get(this.tinymceId).setContent(content)
      },
      updateContent (content) {
        this.formDialog.content = content
      },
      initAllUserMap(){
        var vm = this
        vm.$http({
          method: 'get',
          url: vm.url.allUser,
        }).then(res=>{
          var resData = res.data
          if(resData.code==1){
            var userData = resData.data
            var len = userData.length,i,item,allUserMap={},allUser=[];
            for(i=0;i<len;i++){
              item = userData[i]
              allUserMap[item.id] = item.nickName
              allUser.push({
                value: item.id,
                label: item.nickName || item.id
              })
            }
            vm.allUserMap = allUserMap
            vm.allUser = allUser
          }else{
            vm.$Message.error(resData.message)
          }
        }).catch(err=>{})
      },
      initData(){
        var vm = this
        vm.initAllUserMap()
        if(sessionStorage.chinaData){
          var chinaData = JSON.parse(sessionStorage.chinaData)
          vm.chinaData = chinaData
          vm.chinaJson = vm.util.getChinaJsonByData(chinaData)
        }
      }
    }
  }
</script>
<style scoped>

</style>
