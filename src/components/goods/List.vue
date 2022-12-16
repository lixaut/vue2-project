<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区 -->
    <el-card>
      <!-- 头部功能区 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="getGoodsParams.query"
            clearable
            @clear="handleSearchClear"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="searchGoods"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoodsBtn">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 中部数据表格区 -->
      <el-table :data="goodsList" border>
        <el-table-column align="center" type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column
          align="center"
          label="商品价格(元)"
          prop="goods_price"
          width="110"
        ></el-table-column>
        <el-table-column
          align="center"
          label="商品重量"
          prop="goods_weight"
          width="110"
        ></el-table-column>
        <el-table-column align="center" label="创建时间" width="100">
          <template slot-scope="{ row }">
            {{ row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="140">
          <el-button size="mini" icon="el-icon-edit" type="success"></el-button>
          <el-button
            size="mini"
            icon="el-icon-delete"
            type="danger"
          ></el-button>
        </el-table-column>
      </el-table>

      <!-- 底部分页栏区 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="getGoodsParams.pagenum"
        :page-size="5"
        :page-sizes="[5, 10, 15, 20]"
        layout="jumper, prev, pager, next, ->, sizes, total"
        :total="total"
      >
        ></el-pagination
      >
    </el-card>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "List",
  data() {
    return {
      getGoodsParams: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      goodsList: [],
      total: 0,
    };
  },
  filters: {
    dateFormat(time) {
      if (!time) return "";
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    async getGoodsList() {
      const { data: res } = await this.$http.reqGetGoodsList(
        this.getGoodsParams
      );
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品列表失败！");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 每页展示数量变化回调
    handleSizeChange(pageSize) {
      this.getGoodsParams.pagesize = pageSize;
      this.getGoodsList();
    },
    // 当前页改变回调
    handleCurrentChange(currentPage) {
      this.getGoodsParams.pagenum = currentPage;
      this.getGoodsList();
    },
    // 查询商品
    searchGoods() {
      this.getGoodsList();
    },
    // 搜索商品输入框清除
    handleSearchClear() {
      this.getGoodsList()
    },
    // 添加商品按钮
    addGoodsBtn() {
      this.$router.push('/home/goods/addgoods')
    }
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  margin: 20px 0;
  font-size: 12px;
}
</style>