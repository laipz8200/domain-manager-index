<template>
<div class="admin">
    <Divider />
    <div v-if="isAdmin">
        <Button @click="getUserInformation()" style="width: 100%">刷新</Button>
        
        <Table v-if="isMobile" :columns="mobileColumns" :data="tableData"></Table>
        <Table v-else :columns="columns" :data="tableData"></Table>
    </div>
    <Divider />
    <Button v-if="isMobile" @click="$router.push('/user')" style="width: 100%">返回</Button>
</div>
</template>

<script>
export default {
    name: 'Admin',
    props: ['user_data', 'isMobile'],
    data () {
        return {
            columns: [
                { title: 'ID',  key: 'id' },
                { title: '用户', key: 'username' },
                { title: '组',   key: 'userrank' },
                { title: '更新', key: 'update' },
                { title: '状态', key: 'status', 
                  render: (h, params) => {
                      return h('Tag', {
                          props: { color: params.row.status === 1 ? 'success' : 'error' }
                      }, params.row.status === 1 ? '在线' : '离线')
                  }},
            ],
            mobileColumns: [
                { title: 'ID',  key: 'id' },
                { title: '用户', key: 'username' },
                { title: '状态', key: 'status', 
                  render: (h, params) => {
                      return h('Tag', {
                          props: { color: params.row.status === 1 ? 'success' : 'error' }
                      }, params.row.status === 1 ? '在线' : '离线')
                  }},
            ],
            tableData: [],
        }
    },
    computed: {
        isAdmin() {
            return this.user_data ? (this.user_data.userrank === 'admin' ? true : false) : false
        }
    },
    methods: {
        getUserInformation() {
            this.tableData = []
            $.ajax(process.env.URL_PATH + '/api/get_user_information', {
                dataType: 'json',
                data: {
                    user_id: this.user_data.id,
                    token: this.user_data.token
                },
                success: function(response) {
                    if (response.code === 0) {
                        let dataList = response.data
                        for (var i = 0; i < dataList.length; i++) {
                            this.tableData.push({
                                id: dataList[i]['id'],
                                username: dataList[i]['username'],
                                userrank: dataList[i]['userrank'],
                                update: dataList[i]['update'],
                                status: dataList[i]['status'],
                            })
                        }
                    }
                }.bind(this)
            })
        }
    },
    created() {
        this.getUserInformation()
    }
}
</script>
