<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- card 卡片视图 -->
    <el-card>
      <!-- 顶部功能区 -->
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 商品分类表单 -->
      <el-table
        :data="cateList"
        row-key="cat_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column label="分类名称" prop="cat_name"></el-table-column>
        <el-table-column align="center" label="是否有效">
          <template slot-scope="scope">
            <i
              v-if="scope.row.cat_deleted === false"
              class="el-icon-success"
            ></i>
            <i v-else class="el-icon-error"></i>
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="{ row }">
            <el-tag size="mini" type="danger" v-show="row.cat_level === 0"
              >一级</el-tag
            >
            <el-tag size="mini" type="warning" v-show="row.cat_level === 1"
              >二级</el-tag
            >
            <el-tag size="mini" type="success" v-show="row.cat_level === 2"
              >三级</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column width="200px" align="center" label="操作">
          <template>
            <el-button size="mini" type="success" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="jumper, prev, pager, next, ->, sizes, total"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Cate",
  data() {
    return {
      // 商品分类数据列表
      cateList: [],
      total: 0,
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.reqGetGoodsCate(this.queryInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败！");
      }
      this.cateList = res.data.result;
      this.total = res.data.total;
    },
    // pagesize 改变回调
    handleSizeChange(newPagesize) {
      this.queryInfo.pagesize = newPagesize
      this.getCateList()
    },
    // 当前页改变回调
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum
      this.getCateList()
    }
  },
};
</script>

<style lang="scss">
.el-icon-error {
  color: $theme-r;
}
.el-icon-success {
  color: $theme-g;
}
.el-table {
  margin: 20px 0;
}
</style>