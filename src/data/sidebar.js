// key对应跳转路由的name ，这样可以直接进行路由跳转，这样做好不好不知道
const sidebarData = {
  data: [
    {
      key: 'authority',
      title: '权限管理',
      icon: '',
      children: [
        {
          key: 'resource',
          icon: '',
          text: '资源管理'
        }, {
          key: 'role',
          icon: '',
          text: '角色管理'
        }, {
          key: 'user',
          icon: '',
          text: '用户管理'
        }
      ]
    }, {
      key: 'member',
      title: '会员管理',
      icon: '',
      children: [
        {
          key: 'member_child',
          icon: '',
          text: '会员管理'
        }
      ]
    }, {
      key: 'news',
      title: '新闻管理',
      icon: '',
      children: [
        {
          key: 'news_child',
          icon: '',
          text: '新闻管理'
        }
      ]
    }, {
      key: 'ad',
      title: '广告管理',
      icon: '',
      children: [
        {
          key: 'ad_child',
          icon: '',
          text: '广告管理'
        }
      ]
    }, {
      key: 'guide',
      title: '办事指南',
      icon: '',
      children: [
        {
          key: 'workClass',
          icon: '',
          text: '办事分类'
        }, {
          key: 'workMatter',
          icon: '',
          text: '办事事项'
        }
      ]
    }, {
      key: 'policy',
      title: '招商引资',
      icon: '',
      children: [
        {
          key: 'policy_child',
          icon: '',
          text: '招商引资'
        }
      ]
    }, {
      key: 'gover',
      title: '政务信息',
      icon: '',
      children: [
        {
          key: 'gover_child',
          icon: '',
          text: '政务信息'
        }
      ]
    }
  ]
}
export default sidebarData
