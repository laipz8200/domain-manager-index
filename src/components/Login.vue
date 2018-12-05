<template>
<div class="login">
    <Row type="flex">
        <i-col span="24">
            <Form ref="formData" :model="formData" :rules="rules" inline v-if="!user_data">
                <FormItem prop="username">
                    <i-input type="text" v-model="formData.username" placeholder="用户名">
                        <Icon type="ios-person-outline" slot="prepend"></Icon>
                    </i-input>
                </FormItem>
                <FormItem prop="password">
                    <i-input type="password" v-model="formData.password" placeholder="密码" @keyup.enter.native="submitForm('formData')">
                        <Icon type="ios-lock-outline" slot="prepend"></Icon>
                    </i-input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="submitForm('formData')">登陆</Button>
                </FormItem>
            </Form>
            <Alert v-else type="success">
                您已成功登陆!
                <template slot="desc">
                    <p>
                        请跳转至其他页面继续操作
                    </p>
                </template>
            </Alert>
        </i-col>
    </Row>
</div>
</template>

<script>
import { setCookie } from '@/utils/cookie.js'
export default {
    name: 'Login',
    props: ['user_data'],
    data () {
        return {
            formData: {
                username: '',                                       // 用户名
                password: '',                                       // 密码
            },                                                      // 表单数据
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' }
                ]
            },                                                      // 表单数据的验证规则
        }
    },
    methods: {
        submitForm(formName) {                                      // 提交表单
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$Loading.start()                               // 进度条出现
                $.ajax(process.env.URL_PATH + '/api/login', {       // 调用登陆接口
                    dataType: 'json',                               // 请求json类型数据
                    data: {
                        username: this.formData.username,
                        password: this.formData.password
                    },
                    success: function(response) {
                        if (response.code === 0) {                  // 判断操作结果
                            let data = response.data                // 提取目标数据
                            setCookie('id', data.id, 1)             // 设置cookies的id
                            setCookie('token', data.token, 1)       // 设置cookies的token
                            this.$Loading.finish()                  // 加载完成
                            this.$router.push('/user')
                            location.reload()                       // 重新载入页面使cookies生效
                        } else {
                            this.$Loading.error()
                            this.$Message.error(data.msg);          // 弹出错误提示
                        }
                    }.bind(this),
                    error: function(error) {
                        this.$Loading.error()
                        console.error(error)
                    }.bind(this)
                })
            } else {
                return false;
            }
            });
        },
        resetForm(formName) {                                       // 重置表单
            this.$refs[formName].resetFields();
        }
    }
}
</script>

<style>

</style>
