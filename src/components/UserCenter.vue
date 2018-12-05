<template>
<div class="userCenter">
    <Divider />
    <Row type="flex" justify="center">
        <i-col :xs="24" :sm="18" :md="14" :lg="10">

            <CellGroup v-if="isLogined">
                <Cell title="用户名" :extra="userData.username" selected />
                <Cell title="ID" :extra="userData.id" />
                <Cell title="TOKEN" :extra="userData.token" />
                <Cell title="用户等级" :extra="userData.rank" />
                <Cell title="用户状态">
                    <Tag slot="extra" :color="userData.status === 1 ? 'success' : 'error'">{{ userData.status === 1 ? '在线' : '离线' }}</Tag>
                </Cell>
                <Cell title="登陆微信" extra="点击登录微信" to="/user/wechat" />
                <Cell title="管理用户" to="/admin" v-if="userData.rank === 'admin'" />
                <Cell title="注销" to="/logout" />
            </CellGroup>

            <Alert v-else type="error">
                请先登陆
                <template slot="desc">
                    <p>
                        点击菜单后选择登陆即可登陆
                    </p>
                </template>
            </Alert>
        </i-col>
    </Row>
    <Divider />
</div>
</template>

<script>
import { removeCookie } from '@/utils/cookie.js'

export default {
    name: 'UserCenter',
    props: ['user_data'],  // 从上级获取用户信息
    methods: {
        loginWeChat() {
            this.$router.push('/user/wechat')
        },
        logout() {
            // 清除cookies
            removeCookie('id')
            removeCookie('token')
            location.reload()                       // 刷新页面
        }
    },
    computed: {
        isLogined() {
            return this.user_data ? true : false
        },
        userData() {
            return {
                username: this.user_data ? this.user_data.username : 'None',
                id:       this.user_data ? this.user_data.id : -1,
                token:    this.user_data ? this.user_data.token : 'None',
                rank:     this.user_data ? this.user_data.userrank : 'None',
                endtime:  this.user_data ? this.user_data.endtime : new Date(),
                status:   this.user_data ? this.user_data.status : 'None'
            }
        }
    }
}
</script>