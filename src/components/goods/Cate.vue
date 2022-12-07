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
          <el-button type="primary" @click="addCateBtn">添加分类</el-button>
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

      <!-- 添加分类对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCateDialogVisible"
        @close="addCateDialogClosed"
      >
        <!-- 添加分类表单 -->
        <el-form
          :model="addCateInfo"
          label-width="80px"
          :rules="addCateRules"
          status-icon
          ref="addCateFormRef"
        >
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addCateInfo.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类">
            <el-cascader
              v-model="selectedKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="cascaderChanged"
            >
            </el-cascader>
          </el-form-item>
        </el-form>

        <!-- 底部按钮 -->
        <div slot="footer">
          <el-button @click="addCateDialogVisible = false">取 消</el-button>
          <el-button @click="addCateDialogSubmit" type="primary"
            >确 定</el-button
          >
        </div>
      </el-dialog>
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
      addCateDialogVisible: false,
      addCateInfo: {
        cat_pid: 0,
        cat_name: "",
        cat_level: 0,
      },
      // 添加分类验证规则
      addCateRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类列表
      parentCateList: [],
      cascaderProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover",
        checkStrictly: true,
      },
      // 层级选择其选中的keys
      selectedKeys: [],
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
      this.queryInfo.pagesize = newPagesize;
      this.getCateList();
    },
    // 当前页改变回调
    handleCurrentChange(newPagenum) {
      this.queryInfo.pagenum = newPagenum;
      this.getCateList();
    },
    // 添加分类对话框提交按钮
    addCateDialogSubmit() {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.reqAddCate(this.addCateInfo)
        if (res.meta.status !== 201) {
          this.$message.error('添加分类失败！')
        }
        this.$message.success('添加分类成功！')
        this.getCateList()
        this.addCateDialogVisible = false;
      }) 
    },
    // 添加分类按钮
    addCateBtn() {
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类列表
    async getParentCateList() {
      const { data: res } = await this.$http.reqGetGoodsCate({ type: 2 });
      if (res.meta.status !== 200) {
        return this.$message.error("获取父级列表失败！");
      }
      this.parentCateList = res.data;
    },
    // 层级选择器发生变化
    cascaderChanged() {
      if (this.selectedKeys.length > 0) {
        this.addCateInfo.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        this.addCateInfo.cat_level = this.selectedKeys.length
      } else {
        this.addCateInfo.cat_pid = 0
        this.addCateInfo.cat_level = 0
      }
    },
    // 添加分类对话框关闭回调
    addCateDialogClosed() {
      this.selectedKeys = [];
      this.$refs.addCateFormRef.resetFields()
      this.addCateInfo.cat_pid = 0
      this.addCateInfo.cat_level = 0
    },
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
.el-cascader {
  width: 100%;
}
</style>