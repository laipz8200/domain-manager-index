<template>
<div class="domainTable">
  <Divider />
  <Row type="flex" justify="center">
    <i-col span="24">
      <Table v-if="isMobile" :columns="mobileColumns" :data="tableData"></Table>
      <Table v-else :columns="columns" :data="tableData" border stripe></Table>
    </i-col>
  </Row>
  <Row v-if="isMobile" type="flex" justify="center">
    <i-col span="24">
      <Page simple :total="item_count" @on-change="handleCurrentChange" />
    </i-col>
  </Row>
  <Row v-else type="flex" justify="center">
    <i-col span="18">
      <!-- <Page :total="item_count" show-sizer show-elevator show-total :page-size-opts="[10, 20, 50, 100]" @on-change="handleCurrentChange" @on-page-size-change="handleSizeChange" transfer /> -->
      <Page :total="item_count" show-total @on-change="handleCurrentChange" transfer />
    </i-col>
    <i-col span="6">
      <div style="float: right">
        <Select v-model="where_condition" style="width:200px">
            <Option v-for="item in where_condition_list" :value="item.value" :key="item.value">{{ item.label }}</Option>
        </Select>
      </div>
    </i-col>
  </Row>
  <BackTop></BackTop>
  <Divider />  
</div>
</template>

<script>
export default {
  name: 'DomainTable',
  props: ['user_data', 'isMobile'],
  data () {
    return {
      mobileColumns: [
        { title: '域名',    key: 'domain' },
        { title: '价格',    key: 'price' },
        { title: '微信状态',
          children: [
            { title: '一级', key: 'status', width: 70,
              render: (h, params) => {
                if (params.row.status === 0) {
                  return h('Icon', {
                    props: { type: 'md-checkmark-circle', size: '25', color: '#19be6b' }
                  })
                } else if (params.row.status === 2) {
                  return h('Icon', {
                    props: { type: 'md-close-circle',     size: '25', color: '#ed4014' }
                  })
                } else {
                  return h('Icon', {
                    props: { type: 'md-alert',            size: '25', color: '#ff9900' }
                  })
                }
              }
            },
            { title: '二级', key: 'status2', width: 70,
              render: (h, params) => {
                if (params.row.status2 === 0) {
                  return h('Icon', {
                    props: { type: 'md-checkmark-circle', size: '25', color: '#19be6b' }
                  })
                } else if (params.row.status2 === 2) {
                  return h('Icon', {
                    props: { type: 'md-close-circle',     size: '25', color: '#ed4014' }
                  })
                } else {
                  return h('Icon', {
                    props: { type: 'md-alert',            size: '25', color: '#ff9900' }
                  })
                }
              }
            }
          ]
        },
      ],
      columns: [
        { title: '域名',    key: 'domain' },
        { title: '价格',    key: 'price', width: 80 },
        { title: '到期',    key: 'date' },
        { title: '来源',    key: 'site' },
        { title: '微信状态',
          children: [
            { title: '一级', key: 'status', width: 70,
              render: (h, params) => {
                if (params.row.status === 0) {
                  return h('Icon', {
                    props: { type: 'md-checkmark-circle', size: '25', color: '#19be6b' }
                  })
                } else if (params.row.status === 2) {
                  return h('Icon', {
                    props: { type: 'md-close-circle',     size: '25', color: '#ed4014' }
                  })
                } else {
                  return h('Icon', {
                    props: { type: 'md-alert',            size: '25', color: '#ff9900' }
                  })
                }
              }
            },
            { title: '二级', key: 'status2', width: 70,
              render: (h, params) => {
                if (params.row.status2 === 0) {
                  return h('Icon', {
                    props: { type: 'md-checkmark-circle', size: '25', color: '#19be6b' }
                  })
                } else if (params.row.status2 === 2) {
                  return h('Icon', {
                    props: { type: 'md-close-circle',     size: '25', color: '#ed4014' }
                  })
                } else {
                  return h('Icon', {
                    props: { type: 'md-alert',            size: '25', color: '#ff9900' }
                  })
                }
              }
            }
          ]
        },
        { title: '更新',    key: 'update' },
      ],
      tableData: [],                                                    // 表格数据
      where_condition_list: [
        { label: '显示全部', value: null, },
        { label: '微信可用', value: 'status=0 and status2=0', },
        { label: '微信被封', value: 'status=2 and status2=2', },
        { label: '检测失败', value: 'status=3 or status2=3', },
        { label: '二级可用', value: 'status=2 and status2=0', },
      ],                                                                // 筛选条件
      row_count: 0,                                                     // 索引
      offset: 10,                                                       // 偏移量
      where_condition: null,                                            // 筛选条件
      item_count: 0,                                                    // 总条目
    }
  },
  methods: {
    getItem: function() {
      let where_condition = ''
      if (this.where_condition) {
        where_condition = 'where ' + this.where_condition     // 格式化条件
      }
      this.$Loading.start()
      $.ajax(process.env.URL_PATH + '/api/get_domain', {
        dataType:'json',                                      // 请求格式
        data: {
          row_count:       this.row_count,
          offset:          this.offset,
          where_condition: where_condition,
        },                                                    // 请求参数
        success: function(response) {
          if (response.code === 0) {
            let data = response.data
            this.item_count = data.count                      // 获取总数
            this.tableData = []                               // 清空表格
            let dataList = data.data
            for (var i = 0; i < dataList.length; i++) {
              this.tableData.push({
                domain:   dataList[i]['domain'],
                site:     dataList[i]['site'],
                price:    dataList[i]['price'],
                date:     dataList[i]['date'],
                status:   dataList[i]['status'],
                status2:  dataList[i]['status2'],
                update:   dataList[i]['update'],
              })
            }
            this.$Loading.finish()
          } else {
            console.warn(data.msg)
            this.$Loading.error()
          }
        }.bind(this),
        error: function(error) {
          console.error(error)
          this.$Loading.error()
        }.bind(this)
      })
    },
    handleSizeChange(val) {                      // 页码大小变动
      this.offset = val
      this.row_count = 0
      this.getItem()
    },
    handleCurrentChange(val) {                   // 当前页变动
      this.row_count = (val - 1) * this.offset
      this.getItem()
    }
  },
  created: function() {                          // 初始化时获取数据
    this.getItem()
  }, 
  watch: {
    where_condition() {                          // 监控筛选条件, 变化时重新获取
      this.getItem()
    }
  }
}
</script>