<template>
    
</template>
<script>
import { removeCookie } from '@/utils/cookie.js'

export default {
    name: 'Logout',
    created() {
        // 清除cookies
        removeCookie('id')
        removeCookie('token')
        this.$router.push('/')
        this.$router.go(0)
    }
}
</script>
