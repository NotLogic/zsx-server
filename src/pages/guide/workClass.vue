<template>
  <div class="work-class">
    办事分类
    <Form inline>
      <Button type="primary" @click="addRow" size="small">添加</Button>
    </Form>
    <Form ref="formSearch" inline :label-width="80">
        <FormItem label="分类名称" prop="searchClassName">
            <Input v-model="formSearch.className" placeholder="分类名称" size="small" style="width: 120px"></Input>
        </FormItem>
        <FormItem label="关联地区">
            <Cascader :data="provinceCityData" v-model="derail_address_obj_s" @on-change="searchAddrChange" filterable size="small" style="margin-top: 5px;"></Cascader>
        </FormItem>
        <FormItem label="状态" prop="searchClassStatus">
            <Select v-model="formSearch.classStatus" placeholder="请选择" style="width: 80px;" size="small" clearable>
                <Option value="0">无效</Option>
                <Option value="1">有效</Option>
            </Select>
        </FormItem>
        <FormItem label="分类类别" prop="SearchClassType">
            <Select v-model="formSearch.classType" size="small" style="width: 80px;">
                <Option v-for="item in classType" :value="item.value" :key="item">{{ item.label }}</Option>
            </Select>
        </FormItem>        
          <Button type="primary" style="margin-top: 5px;" @click="submitSearch('formSearch')" size="small">查找</Button>
          <Button type="ghost" style="margin-left: 8px;margin-top: 5px;" @click="_resetSearch('formSearch')" size="small">清空</Button>        
    </Form>
    <mainTable :columns="columns1" :data="data1"></mainTable>
    <paging :total="myTotal"></paging>
  </div>
</template>

<script>
  import mainTable from '@/components/mainTable'
  import paging from '@/components/paging'
  export default {
    components: {
      mainTable,
      paging
    },
    data () {
      return {
        myTotal: 100,
        columns1: [],
        data1: [],
        derail_address_obj_s: [],
        provinceCityData: [],
        classType: [],
        formSearch: {
          input: '',
          className: '',
          classStatus: '',
          classType: '',
          cityCode: ''
        },
        rules: {}
      }
    },
    methods: {
      addRow () {
        console.log('添加行')
      },
      _resetSearch (name) {},
      searchAddrChange () {}
    },
    // 生命周期钩子函数VNode替换原始dom时触发，不是对象，切记
    mounted () {
      // console.log('原始DOM被VNode替换')
    }
  }
</script>

<style scoped>

</style>
