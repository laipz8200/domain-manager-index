<style scoped>
.layout-con {
  height: 100%;
  width: 100%;
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>
<template>
<div id="app">
    <div class="layout">
        <Layout :style="{minHeight: '100vh'}">
            <Sider collapsible :collapsed-width="78" v-model="isCollapsed" v-if="!isMobile">
                <Menu :active-name="activeMenu" theme="dark" width="auto" :class="menuitemClasses">
                    <router-link to="/checker">                    
                      <menu-item name="1">
                          <Icon type="ios-search" />
                          <span>检测接口</span>
                      </menu-item>
                    </router-link>
                    <router-link to="/table">                    
                      <menu-item name="2">
                          <Icon type="ios-book" />
                          <span>查看域名</span>
                      </menu-item>
                    </router-link>
                    <router-link to="/user">
                      <menu-item name="3">
                          <Icon type="ios-person" />
                          <span>个人中心</span>
                      </menu-item>
                    </router-link>
                    <router-link to="/admin" v-if="user_data ? (user_data.userrank === 'admin' ? true : false) : false">
                      <menu-item name="4">
                          <Icon type="ios-settings" />
                          <span>管理后台</span>
                      </menu-item>
                    </router-link>
                </Menu>
            </Sider>
            <Layout>
                <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}" v-if="isMobile">
                <!-- <Header :style="{background: '#fff', boxShadow: '0 2px 3px 2px rgba(0,0,0,.1)'}"> -->
                  <mobile-info :user_data="user_data"></mobile-info>
                </Header>
                <Content :style="{padding: '0 16px 16px'}">
                    <br>
                    <login v-if="!user_data && !isMobile && $route.path != '/login'"></login>
                    <user-info v-if="user_data && !isMobile" :user_data="user_data"></user-info>
                    <Card>
                        <div>
                          <router-view :user_data="user_data" :isMobile="isMobile"/>
                        </div>
                    </Card>
                </Content>
            </Layout>
        </Layout>
    </div>
</div>
</template>
<script>
import Login from "./components/Login";
import UserInfo from "./components/UserInfo";
import MobileInfo from "./components/MobileInfo";
import { getCookie } from "./utils/cookie.js";

export default {
  name: "App",
  components: {
    Login,
    UserInfo,
    MobileInfo
  }, // 导入部件
  data() {
    return {
      user_data: null, // 用户数据
      isCollapsed: true,
      activeMenu: "1" // 当前激活的菜单
    };
  },
  computed: {
    menuitemClasses() {
      return ["menu-item", this.isCollapsed ? "collapsed-menu" : ""];
    },
    isMobile() {
      var userAgentInfo = navigator.userAgent;
      var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod"];
      var flag = false;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = true;
          break;
        }
      }
      return flag;
    }
  },
  methods: {
    menuList() {
      // 定义高亮和路由
      let path = this.$route.path; // 获取到地址拦上#号后面的url地址

      if (path.indexOf("/table") != -1) {
        // 是否包含，-1是包含，0不包含
        this.activeMenu = "2";
      } else if (path.indexOf("/user") != -1) {
        this.activeMenu = "3";
      } else if (path.indexOf("/admin") != -1) {
        this.activeMenu = "4";
      }
    }
  },
  mounted() {
    // 组件初始化后执行
    this.menuList();
  },
  created() {
    // 载入app时首先利用cookies查询用户登陆状态
    let id = getCookie("id");
    let token = getCookie("token");
    if (id && token) {
      // 如果获取到id和token
      $.ajax(process.env.URL_PATH + "/api/auto_login", {
        // 发送请求验证用户登陆
        dataType: "json", // 请求json数据
        data: {
          user_id: id,
          token: token
        }, // 请求参数为id和token
        success: function(response) {
          if (response.code === 0) {
            let data = response.data; // 提取用户信息

            this.user_data = data; // 更新用户信息
          }
        }.bind(this)
      });
    } else {
      this.$router.push("/login");
    }
  }
};
</script>