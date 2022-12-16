<template>
  <div class="add-goods">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 顶部提示区 -->
      <el-alert
        :closable="false"
        center
        show-icon
        type="info"
        title="添加商品信息"
      ></el-alert>

      <!-- 步骤条展示区 -->
      <el-steps :active="activeStep" align-center finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- form 表单区 -->
      <el-form :model="addGoodsInfo" :rules="addGoodsRules">
        <!-- 侧边标签页 -->
        <el-tabs
          tab-position="left"
          v-model="activeTab"
          :before-leave="tabsBeforeLeave"
        >
          <el-tab-pane label="基本信息" name="0">
            <!-- 基本信息表单部分 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsInfo.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsInfo.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsInfo.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsInfo.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="cascaderValue"
                :options="cateList"
                :props="cascaderProps"
                @change="cascaderChanged"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1"></el-tab-pane>
          <el-tab-pane label="商品属性" name="2"></el-tab-pane>
          <el-tab-pane label="商品图片" name="3"></el-tab-pane>
          <el-tab-pane label="商品内容" name="4"></el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "AddGoods",
  data() {
    return {
      activeTab: "0",
      addGoodsInfo: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
      },
      cascaderValue: [],
      cascaderProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      cateList: [],
      // 验证规则
      addGoodsRules: {
        goods_name: [
          { required: true, message: '请填写商品名称', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '请填写商品价格', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '请填写商品重量', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '请填写商品数量', trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    activeStep() {
      return +this.activeTab;
    },
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.reqGetGoodsCate();
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类数据失败!");
      }
      this.cateList = res.data;
    },
    // cascader 值变化了
    cascaderChanged(cascaderValue) {
      if (cascaderValue.length === 2) {
        this.cascaderValue = [];
      }
    },
    // tab切换前钩子
    tabsBeforeLeave(activeTab, oldActiveTab) {
      if (oldActiveTab == 0 && this.cascaderValue.length == 0) {
        this.$message.warning('请先选择商品分类!')
        return false
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.el-steps {
  margin: 20px 0;
}
</style>