<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <!-- 头部功能区域 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色表格 -->
      <el-table :data="rolesList">
        <el-table-column type="expand">
          <template></template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <el-button size="mini" icon="el-icon-edit" type="success">编辑</el-button>
          <el-button size="mini" icon="el-icon-delete" type="danger">删除</el-button>
          <el-button size="mini" icon="el-icon-setting" type="warning">分配角色</el-button>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Roles',
  data() {
    return {
      rolesList: []
    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.reqGetRolesList()
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
}
</style>