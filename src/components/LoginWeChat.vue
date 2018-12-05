<template>
<div class="loginWeChat">
    <Divider />
    <Row type="flex" justify="center">
        <i-col :xs="24" :sm="12" :md="10" :lg="8">
            <Button @click="getQrCode()" style="width: 100%">刷新</Button>
            <Card>
                <div style="text-align:center">
                    <Spin fix size="large" v-if="loading"></Spin>
                    <img :src="qrCodeImage" style="height: 100%; width: 100%">
                    <h3>请使用微信扫码登陆</h3>
                </div>
            </Card>
        </i-col>
    </Row>
    <Divider />
    <Button v-if="isMobile" @click="$router.push('/user')" style="width: 100%">返回</Button>
</div>
</template>

<script>
export default {
    name: 'LoginWeChat',
    props: ['user_data', 'isMobile'],
    data () {
        return {
            qrCodeImage: '',
            loading: true,
        }
    },
    methods: {
        getQrCode() {
            this.loading = true                                 // 开始加载
            $.ajax(process.env.URL_PATH + '/api/login/we_chat/get_qr', {
                dataType: 'json',
                success: function(response) {
                    if (response.code === 0) {
                        let data = response.data
                        this.qrCodeImage = data.url             // 显示二维码
                        this.waitForLogin(data.uuid)            // 等待登陆
                        this.loading = false                    // 停止加载
                    }
                }.bind(this),
                error: function(error) {
                    console.error(error)                        // 在控制台打印错误信息
                }.bind(this)
            })
        },
        waitForLogin(uuid) {                                    // 请求微信登陆状态
            $.ajax(process.env.URL_PATH + '/api/login/we_chat/get_status', {
                dataType: 'json',
                data: {
                    user_id: this.user_data.id,
                    uuid: uuid                                  // 需要附带被扫描二维码的uuid
                },
                success: function(response) {
                    if (response.code === 0) {
                        let data = response.data
                        location.reload()                       // 刷新页面
                        this.$router.push('/user')
                    } else {
                        this.loading = true
                    }
                }.bind(this),
                error: function(error) {
                    console.error(error)
                    this.loading = true
                }.bind(this)
            })
        }
    },
    created() {
        this.getQrCode()
    }
}
</script>