<template>
  <el-container>

    <!-- 头部区域 -->
    <el-header>
      <div class="header-info" @click="goHome">
        <img
          class="brand-logo"
          src="@/assets/logo.jpg"
          alt="电商后台管理平台logo"
        />
        <span class="platform-name">电商后台管理平台</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体 -->
    <el-container>
      
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleAside">
          <i v-if="!isCollapse" class="el-icon-s-fold"></i>
          <i v-else class="el-icon-s-unfold"></i>
        </div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="$route.path"
        >
          <el-submenu
            :index="item1.order + ''"
            v-for="item1 in menuList"
            :key="item1.id"
          >
            <template slot="title">
              <i :class="menuIcons[item1.id]"></i>
              <span>{{ item1.authName }}</span>
            </template>
            <el-menu-item
              :index="'/home/' + item2.path"
              v-for="item2 in item1.children"
              :key="item2.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item2.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      menuList: [],
      menuIcons: {
        125: "iconfont icon-yonghu",
        103: "iconfont icon-quanxian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-dingdan",
        145: "iconfont icon-shuju",
      },
      isCollapse: false
    };
  },
  created() {
    this.getMenuList();
  },
  methods: {
    logout() {
      sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMenuList() {
      const { data: res } = await this.$http.reqGetMenu();
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.menuList = res.data;
    },
    // 显示/隐藏侧边栏
    toggleAside() {
      this.isCollapse = !this.isCollapse
    },
    // 图标导航
    goHome() {
      this.$router.push('/home')
    }
  },
};
</script>

<style lang="scss" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .header-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 20px;
      color: #fff;
      .platform-name {
        padding-left: 20px;
        letter-spacing: 2px;
        user-select: none;
      }
      .brand-logo {
        height: 60px;
        width: 60px;
      }
    }
  }
  .el-aside {
    background-color: #333744;
    transition: width .2s linear;
    .toggle-btn {
      color: #909399;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-bottom: 1.6px dashed #54565b;
    }
    .iconfont {
      margin: 0 5px;
    }
    .el-menu {
      border-right: 0;
    }
  }
  .el-main {
    background-color: #eee;
  }
}
</style>