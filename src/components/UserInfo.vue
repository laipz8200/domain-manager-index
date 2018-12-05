<template>
<div class="userInfo">
    <Form ref="userData" :model="userData" inline>
        <FormItem prop="username">
            <i-input type="text" v-model="userData.username" disabled>
                <Icon type="ios-person-outline" slot="prepend"></Icon>
            </i-input>
        </FormItem>
        <FormItem>
            <i-switch v-model="userData.status" size="large">
                <span slot="open">Run</span>
                <span slot="close">Stop</span>
            </i-switch>
        </FormItem>
        <FormItem>
            <ButtonGroup>
                <Button @click="loginWeChat()">登陆微信</Button>
                <Button @click="$router.push('/logout')">注销</Button>
            </ButtonGroup>
        </FormItem>
    </Form>
</div>
</template>

<script>
export default {
    name: 'UserInfo',
    props: ['user_data'],
    computed: {
        userData() {
            return {
                username: this.user_data ? this.user_data.username : 'None',
                id:       this.user_data ? this.user_data.id : -1,
                token:    this.user_data ? this.user_data.token : 'None',
                rank:     this.user_data ? this.user_data.userrank : 'None',
                endtime:  this.user_data ? this.user_data.endtime : new Date(),
                status:   this.user_data ? this.user_data.status === 1 ? true : false : false
            }
        }
    },
    methods: {
        loginWeChat() {                             // 登陆微信
            this.$router.push('/user/wechat')
        }
    },
}
</script>
