<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>

      <!-- 权限表格 -->
      <el-table :data="rightsList">
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column align="center" prop="authName" label="权限名称"></el-table-column>
        <el-table-column align="center" prop="path" label="路径"></el-table-column>
        <el-table-column align="center" prop="level" label="权限等级" >
          <template slot-scope="scope">
            <el-tag v-show="scope.row.level == 0" type="danger">一级</el-tag>
            <el-tag v-show="scope.row.level == 1" type="warning">二级</el-tag>
            <el-tag v-show="scope.row.level == 2" type="success">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'Rights',
  data() {
    return {
      rightsList: [],
      type: 'list'
    }
  },
  created() {
    this.getRightsList()
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.reqGetRightsList(this.type)
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.rightsList = res.data
    }
  }
}
</script>

<style lang="scss" scoped>

</style>