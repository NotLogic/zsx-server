// key对应跳转路由的name ，这样可以直接进行路由跳转，这样做好不好不知道
const sidebarData = [
  {
    key: 'authority',
    title: '权限管理',
    icon: 'key',
    children: [
      {
        key: 'resource',
        icon: '',
        title: '资源管理'
      }, {
        key: 'role',
        icon: '',
        title: '角色管理'
      }, {
        key: 'user',
        icon: '',
        title: '用户管理'
      }
    ]
  }, {
    key: 'member',
    title: '会员管理',
    icon: 'locked',
    children: [
      {
        key: 'member_index',
        icon: '',
        title: '会员管理'
      }
    ]
  }, {
    key: 'news',
    title: '新闻管理',
    icon: '',
    children: [
      {
        key: 'news_index',
        icon: '',
        title: '新闻管理'
      }
    ]
  }, {
    key: 'notes',
    title: '帖子管理',
    icon: '',
    children: [
      {
        key: 'notes_index',
        icon: '',
        title: '帖子管理'
      }
    ]
  }, {
    key: 'comment',
    title: '评论管理',
    icon: '',
    children: [
      {
        key: 'comment_index',
        icon: '',
        title: '评论管理'
      }
    ]
  }, {
    key: 'ad',
    title: '广告管理',
    icon: '',
    children: [
      {
        key: 'ad_index',
        icon: '',
        title: '广告管理'
      }
    ]
  }, {
    key: 'appGroup',
    title: '群组管理',
    icon: '',
    children: [
      {
        key: 'appGroup_index',
        icon: '',
        title: '群组管理'
      }
    ]
  }, {
    key: 'adviceBack',
    title: '意见反馈',
    icon: '',
    children: [
      {
        key: 'adviceBack_index',
        icon: '',
        title: '意见反馈'
      }
    ]
  }, {
    key: 'complaint',
    title: '举报管理',
    icon: '',
    children: [
      {
        key: 'complaint_index',
        icon: '',
        title: '举报管理'
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
        title: '办事分类'
      }, {
        key: 'workMatter',
        icon: '',
        title: '办事事项'
      }
    ]
  }, {
    key: 'policy',
    title: '招商引资',
    icon: '',
    children: [
      {
        key: 'policy_index',
        icon: '',
        title: '招商引资'
      }
    ]
  }, {
    key: 'gover',
    title: '政务信息',
    icon: '',
    children: [
      {
        key: 'gover_index',
        icon: '',
        title: '政务信息'
      }
    ]
  }, {
    key: 'sensitiveWord',
    title: '敏感词',
    icon: '',
    children: [
      {
        key: 'sensitiveWords',
        icon: '',
        title: '敏感词库'
      }, {
        key: 'sensitiveWordSettting',
        icon: '',
        title: '敏感词规则'
      }
    ]
  }, {
    key: 'thirdparty',
    title: 'API管理',
    icon: '',
    children: [
      {
        key: 'thirdpartyClass',
        icon: '',
        title: 'API分类'
      }, {
        key: 'thirdpartySetting',
        icon: '',
        title: 'API配置'
      }
    ]
  }, {
    key: 'basiceData',
    title: '基础数据管理',
    icon: '',
    children: [
      {
        key: 'province',
        icon: '',
        title: '省市区'
      }
    ]
  }
]
export default sidebarData
