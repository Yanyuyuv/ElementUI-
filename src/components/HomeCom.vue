<template>
  <div id="HomeContainer">
    <el-container class="HomeContainer">
      <el-header>
        <div>
          <img src="../assets/logo.png" width="15%" height="15%" />
          <span>后台电商管理系统</span>
        </div>
        <el-button type="info" @click="exit">退出</el-button>
      </el-header>
      <el-container>
        <el-aside :width="isCollapse ? '64px' : '200px'">
          <el-menu
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
            background-color="#373d41"
            text-color="#fff"
            active-text-color="#409EFF"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <div class="toggle-button" @click="toggleCollapse">|||</div>
            <!-- 一级菜单 -->
            <el-submenu
              :index="item.id + ''"
              v-for="item in menulist"
              :key="item.id"
            >
              <template slot="title">
                <!-- 图标 -->
                <i :class="iconObj[item.id]"></i>
                <!-- 文本 -->
                <span>{{ item.authName }}</span>
              </template>
              <!-- 二级菜单 -->
              <el-menu-item
                :index="'/' + subItem.path"
                v-for="subItem in item.children"
                :key="subItem.id"
                @click="menuIndex('/' + subItem.path)"
              >
                <template slot="title">
                  <!-- 图标 -->
                  <i class="el-icon-menu"></i>
                  <!-- 文本 -->
                  <span>{{ subItem.authName }}</span>
                </template>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menulist: [],
      iconObj: {
        125: 'el-icon-user',
        103: 'el-icon-user-solid',
        101: 'el-icon-goods',
        102: 'el-icon-tickets',
        145: 'el-icon-data-line'
      },
      isCollapse: false,
      activePath: ''
    }
  },
  // 进入home页面 首先请求菜单数据
  // 然后拿到记录的index 保持菜单状态
  created () {
    this.getMenuList()
  },
  updated () {
    // 网上搜的获取当前路由地址的方法
    const url = location.href
    const route = url.substring(url.lastIndexOf('/') + 1)
    this.menuIndex('/' + route)
    // console.log(route)
  },
  methods: {
    exit () {
      // 清空token
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    handleOpen (key, keyPath) {
      // console.log(key, keyPath)
    },
    handleClose (key, keyPath) {
      // console.log(key, keyPath)
    },
    // 获取菜单数据
    async getMenuList () {
      // 获取菜单数据
      const { data: res } = await this.$http.get('menus')
      // 获取失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 获取成功
      this.menulist = res.data
      // console.log(this.menulist)
    },
    // 菜单折叠触发
    toggleCollapse () {
      // 菜单折叠
      this.isCollapse = !this.isCollapse
    },
    // 点击二级菜单记录Index
    menuIndex (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = window.sessionStorage.getItem('activePath')
      // console.log(path)
    }
  }
}
</script>

<style lang="less">
#HomeContainer {
  width: 100%;
  height: 100%;
}
.HomeContainer {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    display: flex;
    align-items: center;
  }
}
.el-aside {
  background-color: #373d41;
  .el-menu {
    border-inline: none;

    .toggle-button {
      background-color: #4a5064;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 30px;
      font-size: 10px;
      letter-spacing: 2px;
      color: white;
      user-select: none;
      cursor: pointer;
    }
  }
}
.el-main {
  background-color: #eaedf1;
}

// 孩子组件统一样式
.el-breadcrumb {
  margin-bottom: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 12px;
}
</style>
