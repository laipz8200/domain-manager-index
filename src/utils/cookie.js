//获取cookie
export function getCookie(name) {
    if (document.cookie) {
        let cookieArr = document.cookie.split('; ')
        for (var i = 0; i < cookieArr.length; i++) {
            let keyArr = cookieArr[i].split('=')
            if (keyArr[0] === name) {
                return keyArr[1]
            }
        }
    } else {
        return false
    }
}

//设置cookie, 增加到vue实例方便全局调用
export function setCookie(name, val, day) {
    let expireDate = new Date()
    expireDate.setDate(expireDate.getDate() + day)
    document.cookie = `${name}=${val};expires=${expireDate.toString()}`
}

//删除cookie
export function removeCookie(name) {
    let cookie = getCookie(name)
    if (cookie) {
        setCookie(name, null, -1)
    } else {
        return false
    }
}