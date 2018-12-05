<template>
<div class="mobileInfo">
    <Row type="flex" align="middle">
        <i-col span="24">
            <Select v-model="path" style="width:100%" placeholder="功能菜单">
                <Option v-for="item in menuList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
        </i-col>
    </Row>
</div>
</template>
<script>
export default {
    name: 'MobileInfo',
    props: ['user_data'],
    data () {
        return {
            path: ''
        }
    },
    computed: {
        menuList() {
            return [
                { value: '/checker', label: '查询' },
                { value: '/table', label: '表格' },
                { value: this.user_data ? '/user' : '/login', label: this.user_data ? '个人中心' : '登陆'},
            ]
        }
    },
    watch: {
        path(val) {
            this.$router.push(val)
        }
    }
}
</script>
