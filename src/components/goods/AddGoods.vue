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
      <el-form
        v-if="!showResult"
        :model="addGoodsInfo"
        :rules="addGoodsRules"
        label-position="top"
        ref="addGoodsFormRef"
      >
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
              <el-input
                v-model="addGoodsInfo.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodsInfo.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodsInfo.goods_number"
                type="number"
              ></el-input>
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
          <el-tab-pane label="商品参数" name="1">
            <!-- 商品参数表单部分 -->
            <el-form-item
              v-for="item in goodsParams"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  size="mini"
                  border
                  v-for="item2 in item.attr_vals"
                  :key="item2"
                  :label="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <!-- 商品属性表单部分 -->
            <el-form-item
              v-for="item in goodsAttrs"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  size="mini"
                  border
                  v-for="item2 in item.attr_vals"
                  :key="item2"
                  :label="item2"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 商品图片上传表单 -->
            <el-upload
              list-type="picture"
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :headers="uploadHeader"
              :on-success="uploadSuccess"
              :on-error="uploadError"
              :on-remove="uploadRemove"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">
                只能上传jpg/png文件，且不超过500kb
              </div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addGoodsInfo.goods_introduce"></quill-editor>
            <el-button
              size="small"
              class="subBtn"
              @click="subAddGoods"
              type="primary"
              >确认提交</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <!-- 添加结果展示 -->
      <el-result
        v-else
        icon="success"
        title="添加商品成功！"
        :subTitle="countDown + ' 秒后将自动跳转到商品列表页面...'"
      >
        <template slot="extra">
          <el-button @click="goGoodsList" type="primary" size="small"
            >立即跳转</el-button
          >
        </template>
      </el-result>
    </el-card>
  </div>
</template>

<script>
// 引入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: "AddGoods",
  components: {
    quillEditor
  },
  data() {
    return {
      activeTab: "0",
      addGoodsInfo: {
        goods_name: "",
        goods_price: "",
        goods_number: "",
        goods_weight: "",
        pics: [],
        goods_introduce: ''
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
          { required: true, message: "请填写商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请填写商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请填写商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请填写商品数量", trigger: "blur" },
        ],
      },
      // 商品参数
      goodsParams: [],
      // 商品属性
      goodsAttrs: [],
      // 上传图片请求头
      uploadHeader: {
        Authorization: sessionStorage.getItem('token')
      },
      // 添加商品成功结果
      showResult: false,
      // 倒计时
      countDown: 3
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
        this.$message.warning("请先选择商品分类!");
        return false;
      }
      if (activeTab == 1) {
        this.getGoodsParams("many", "商品参数");
      } else if (activeTab == 2) {
        this.getGoodsParams("only", "商品属性");
      }
    },
    // 获取商品参数|商品属性
    async getGoodsParams(manyOrOnly, msg) {
      const { data: res } = await this.$http.reqParamsList({
        cateId: this.cascaderValue[2],
        sel: manyOrOnly,
      });
      if (res.meta.status !== 200) {
        return this.$message.error(`获取${msg}失败！`);
      }
      const newData = res.data.map((item) => {
        item.attr_vals = item.attr_vals.split(",");
        return item;
      });
      if (manyOrOnly === "many") {
        return (this.goodsParams = newData);
      }
      this.goodsAttrs = newData;
    },
    // 照片上传成功的钩子
    uploadSuccess(res, file) {
      this.addGoodsInfo.pics.push({ [file.uid]: res.data.tmp_path })
    },
    // 照片上传失败的钩子
    uploadError(err) {
      this.$message.error(err.meta.msg)
    },
    // 移除图片时的钩子
    uploadRemove(file) {
      this.addGoodsInfo.pics = this.addGoodsInfo.pics.filter(item => {
        return !item[file.uid]
      })
    },
    // 跳转到商品列表页面
    goGoodsList() {
      this.$router.push('/home/goods')
    },
    // 提交添加商品信息
    subAddGoods() {
      this.$refs.addGoodsFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写完整表单！')
        const attrs = []
        this.goodsParams.forEach(item => {
          attrs.push({ attr_id: item.attr_id, attr_value: item.attr_name })
        })
        this.goodsAttrs.forEach(item => {
          attrs.push({ attr_id: item.attr_id, attr_value: item.attr_name })
        })
        let goods_cat = this.cascaderValue.join(',')
        const data = { ...this.addGoodsInfo, attrs, goods_cat}
        const { data: res } = await this.$http.reqAddGoods(data)
        if (res.meta.status !== 201) {
          return this.$message.error('创建商品失败！')
        }
        this.$message.success(res.meta.msg)
        this.activeTab = '6'
        this.showResult = true
        let timer = setInterval(() => {
          if (this.countDown === 0) {
            clearInterval(timer)
            this.goGoodsList()
          }
          this.countDown -= 1
        }, 1000)
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.el-steps {
  margin: 20px 0;
}
.el-upload__tip {
  font-size: 10px;
}
.subBtn {
  margin-top: 20px;
}
</style>