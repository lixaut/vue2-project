<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 分类参数卡片视图 -->
    <el-card>
      <!-- 警告区域 -->
      <el-alert
        show-icon
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
      >
      </el-alert>

      <!-- 选择商品分类区 -->
      <el-row class="selectCate">
        <el-col>
          <span>选择商品分类：</span>
          <el-cascader
            v-model="cascaderValue"
            :options="cateList"
            :props="cascaderProps"
            @change="cascaderChanged"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- tab页签区 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">

        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button :disabled="isBtnDisabled" size="mini" type="primary">添加参数</el-button>
          <!-- 参数数据表格 -->
          <el-table :data="manyList">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" align="center">
              <template>
                <el-button size="mini" type="success" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态参数面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button :disabled="isBtnDisabled" size="mini" type="primary">添加属性</el-button>
          <!-- 属性数据表格 -->
          <el-table :data="onlyList">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" align="center">
              <template>
                <el-button size="mini" type="success" icon="el-icon-edit">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    return {
      cateList: [],
      // 层级选择器配置对象
      cascaderProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // 层级选择器值
      cascaderValue: [],
      activeName: 'many',
      // 动态参数列表
      manyList: [],
      // 静态属性列表
      onlyList: []
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 添加按钮是否隐藏
    isBtnDisabled() {
      if (this.cascaderValue.length !== 3) {
        return true
      }
      return false
    },
    // 商品id
    cateId() {
      if (this.cascaderValue.length === 3) {
        return this.cascaderValue[2]
      }
      return null
    }
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.reqGetGoodsCate();
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.cateList = res.data;
    },
    // 层级选择器值发生变化
    async cascaderChanged() {
      if (this.cascaderValue.length < 3) {
        this.cascaderValue = []
        return
      }
      const { data: res } = await this.$http.reqParamsList({
        cateId: this.cateId,
        sel: this.activeName
      })
      if (res.meta.status !== 200) {
        let str = this.activeName === 'many' ? '动态参数' : '静态属性'
        return this.$message.error(`获取${str}失败！`)
      }
      if (this.activeName === 'many') {
        this.manyList = res.data
      } else {
        this.onlyList = res.data
      }
    },
    // 页签点击事件
    handleTabClick() {
      this.cascaderChanged()
    }
  },
};
</script>

<style lang='scss' scoped>
.selectCate {
  margin: 20px 0;
}
</style>