<template>
<div class="Checker">
    <Divider />
    <Row>
        <i-col span="16" offset="4">
        <div style="text-align: center">
            <h2>{{ title }}</h2>
        </div>
        </i-col>
    </Row>
    <br>
    <Row type="flex" justify="center">
        <i-col :xs="24" :sm="20" :md="16" :lg="12">
        <i-input v-model.trim="text" @keyup.enter.native="check()">
            <Select v-model="select" slot="prepend" style="width: 130px">
                <Option value="wechat">微信域名检测</Option>
                <Option value="qq">QQ网站安全检测</Option>
                <Option value="search">本地域名搜索</Option>
            </Select>
            <i-button slot="append" icon="ios-search" @click="check()"></i-button>
        </i-input>
        </i-col>
    </Row>
    <br>
    <Row type="flex" justify="center" v-if="information">
        <i-col :xs="22" :sm="18" :md="14" :lg="10">
        <Alert :type="alertType">
            {{ information.errmsg }}!
            <template slot="desc">
                <p v-if="select === 'search' && information.domain">
                    域名: {{ information.domain }} <br>
                    价格: {{ information.price }} <br>
                    状态: 一级: {{ information.status }}, 二级: {{ information.status2 }} <br>
                    到期: {{ information.date }} <br>
                    来源: {{ information.site }} <br>
                    更新: {{ information.update }}
                </p>
                <p v-else-if="select != 'search'">
                    备注: {{ information.other }} <br>
                    状态码: {{ information.status }}
                </p>
            </template>
        </Alert>
        </i-col>
    </Row>
    <Divider />
</div>
</template>

<script>
export default {
    name:   'DomainChecker',
    props:  ['user_data'],
    data () {
        return {
            text:          '',           // 输入的信息
            select:        'wechat',     // 检测类型
            information:   null,         // 结果信息
            alertType:     'info',       // 提示类型
        }
    },
    methods: {
        check() {                                                              // 检测方法
            if (!this.text) {                                                  // 排除输入为空的情况
                return 
            }
            if (!this.user_data) {                                             // 如果没有获取到登陆信息
                this.information = {
                    errmsg: '需要登陆',
                    other:  '您所在的用户组没有权限',
                    status: -1
                }
                this.alertType = 'info'
                this.text = ''
                return 
            }
            this.$Loading.start()
            if (this.select === 'wechat') {                                    // 判断需要检测的类型
                $.ajax(process.env.URL_PATH + '/api/we_chat_check', {
                    dataType: 'json',                                          // 响应类型
                    data: {
                        user_id: this.user_data ? this.user_data.id: 0,
                        token:   this.user_data ? this.user_data.token: 'null',
                        domain:  this.text,
                    },                                                         // 需要提交的数据
                    success: function(response) {
                        if (response.code === 0) {                             // 检测后台标记
                            let data = response.data                           // 显示结果

                            this.information = {
                                errmsg: data.errmsg,                           // 检测结果
                                other:  data.domain,                           // 被检测的域名
                                status: data.status                            // 检测代码
                            }                                                
                            if (this.information.status == 0) {
                                this.alertType = 'success'
                            } else if (this.information.status == 2) {
                                this.alertType = 'error'
                            } else {
                                this.alertType = 'info'
                            }
                            this.$Loading.finish()
                        } else {
                            this.information = {
                                errmsg: '后台操作失败',
                                other:  response.msg,
                                status: response.code
                            }
                            this.alertType = 'warning'
                            this.$Loading.error()
                        }
                    }.bind(this),
                    error: function(error) {
                        console.error(error)                                   // 显示错误信息
                        this.information = {
                            errmsg: '请求失败',
                            other:  '检查网络设置',
                            status: -1
                        }
                        this.alertType = 'warning'
                        this.$Loading.error()
                    }.bind(this)
                })
            } else if (this.select === 'qq') {
                $.ajax(process.env.URL_PATH + '/api/qq_check', {
                    dataType: 'json',
                    data: {
                        user_id: this.user_data.id,
                        token:   this.user_data.token,
                        url:     this.text,
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            let data = response.data

                            this.information = {
                                errmsg: data.errmsg,
                                other:  data.url,
                                status: data.status
                            }
                            if (this.information.status === 3) {
                                this.alertType = 'success'
                            } else if (this.information.status === 2) {
                                this.alertType = 'error'
                            } else {
                                this.alertType = 'info'
                            }
                            this.$Loading.finish()
                        } else {
                            this.information = {
                                errmsg: '后台操作失败',
                                other:  data.msg,
                                status: -1
                            }
                            this.alertType = 'warning'
                            this.$Loading.error()
                        }
                    }.bind(this),
                    error: function(error) {
                        console.error(error)
                        this.information = {
                            errmsg: '请求失败',
                            other:  '检查网络设置',
                            status: -1
                        }
                        this.alertType = 'warning'
                        this.$Loading.error()
                    }.bind(this)
                })
            } else if (this.select === 'search') {
                $.ajax(process.env.URL_PATH + '/api/get_domain', {
                    dataType: 'json',
                    data: {
                        row_count:       0,
                        offset:          1,
                        where_condition: `where domain='${this.text}'`,
                    },
                    success: function(response) {
                        if (response.code === 0) {
                            let data = response.data.data[0]

                            this.information = {
                                errmsg:   data ? '查询成功'    : '找不到域名',
                                domain:   data ? data.domain  : null,
                                site:     data ? data.site    : null,
                                price:    data ? data.price   : null,
                                date:     data ? data.date    : null,
                                status:   data ? data.status  : null,
                                status2:  data ? data.status2 : null,
                                update:   data ? data.update  : null,
                            }
                            this.alertType = 'info'
                            this.$Loading.finish()
                        } else {
                            this.information = {
                                errmsg: '找不到域名',
                                status: -1
                            }
                            this.alertType = 'warning'
                            this.$Loading.error()
                        }
                    }.bind(this),
                    error: function(error) {
                        console.error(error)
                        this.information = {
                            errmsg: '请求失败',
                            status: -1
                        }
                        this.alertType = 'warning'
                        this.$Loading.error()
                    }.bind(this)
                })
            }
            this.text = ''                         // 清空输入框
        }
    },
    computed: {
        title() {                                  // 标题
            this.information = null
            if (this.select === 'wechat') {
                return '微信域名检测'
            } else if (this.select === 'qq') {
                return 'QQ网站安全检测'
            } else if (this.select === 'search') {
                return '本地域名搜索'
            }
        }
    }
}
</script>