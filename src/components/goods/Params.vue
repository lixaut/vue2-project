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
          <el-button
            :disabled="isBtnDisabled"
            size="mini"
            type="primary"
            @click="addBtn"
            >添加参数</el-button
          >
          <!-- 参数数据表格 -->
          <el-table :data="manyList">
            <el-table-column type="expand">
              <!-- 表格展开属性 -->
              <template slot-scope="{ row }">
                <el-row>
                  <el-col>
                    <!-- 属性标签 -->
                    <el-tag
                      v-for="item in row.attr_vals"
                      :key="item"
                      closable
                      size="small"
                      disable-transitions
                      @close="handleClose(row, item)"
                      >{{ item }}</el-tag
                    >
                    <!-- 属性输入框 -->
                    <el-input
                      ref="saveTagInput"
                      class="input-new-tag"
                      v-if="row.inputVisible"
                      v-model="inputValue"
                      @keyup.native.enter="handleInputConfirm(row)"
                      @blur="handleInputConfirm(row)"
                    ></el-input>
                    <!-- 添加属性按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(row)"
                      >+ New Tag</el-button
                    >
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{row}">
                <el-button size="mini" type="success" icon="el-icon-edit" @click="editBtn(row)"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteBtn(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态参数面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            :disabled="isBtnDisabled"
            size="mini"
            type="primary"
            @click="addBtn"
            >添加属性</el-button
          >
          <!-- 属性数据表格 -->
          <el-table :data="onlyList">
            <el-table-column type="expand">
              <!-- 表格展开属性 -->
              <template slot-scope="{ row }">
                <el-row>
                  <el-col>
                    <!-- 属性标签 -->
                    <el-tag
                      v-for="item in row.attr_vals"
                      :key="item"
                      closable
                      size="small"
                      disable-transitions
                      @close="handleClose(row, item)"
                      >{{ item }}</el-tag
                    >
                    <!-- 属性输入框 -->
                    <el-input
                      ref="saveTagInput"
                      class="input-new-tag"
                      v-if="row.inputVisible"
                      v-model="inputValue"
                      @keyup.native.enter="handleInputConfirm(row)"
                      @blur="handleInputConfirm(row)"
                    ></el-input>
                    <!-- 添加属性按钮 -->
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(row)"
                      >+ New Tag</el-button
                    >
                  </el-col>
                </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="{row}">
                <el-button size="mini" type="success" icon="el-icon-edit" @click="editBtn(row)"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteBtn(row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框 -->
    <el-dialog
      :title="btnAction + manyOrOnly"
      :visible.sync="addDialogVisible"
      @close="addDialogClosed"
    >
      <!-- 添加属性表单 -->
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="120px"
        :rules="addFormRules"
      >
        <el-form-item :label="manyOrOnly + '名称'" prop="attrName">
          <el-input v-model="addForm.attrName"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮 -->
      <div slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addDialogSubmit">确 定</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
export default {
  name: "Params",
  data() {
    // 属性 参数 名称校验规则
    var checkAttrName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error(`请输入${this.manyOrOnly}名称`));
      }
      callback();
    };
    return {
      cateList: [],
      // 层级选择器配置对象
      cascaderProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
        expandTrigger: "hover",
      },
      // 层级选择器值
      cascaderValue: [],
      activeName: "many",
      // 动态参数列表
      manyList: [],
      // 静态属性列表
      onlyList: [],
      addDialogVisible: false,
      // 添加参数或属性表单
      addForm: {
        attrName: "",
        attrId: ''
      },
      addFormRules: {
        attrName: [
          { required: true, validator: checkAttrName, trigger: "blur" },
        ],
      },
      // 添加标签属性的值
      inputValue: "",
      // 添加｜编辑 按钮
      btnAction: ''
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 添加按钮是否隐藏
    isBtnDisabled() {
      if (this.cascaderValue.length !== 3) {
        return true;
      }
      return false;
    },
    // 商品id
    cateId() {
      if (this.cascaderValue.length === 3) {
        return this.cascaderValue[2];
      }
      return null;
    },
    // 动态参数｜静态属性
    manyOrOnly() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
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
        this.cascaderValue = [];
        this.manyList = [];
        this.onlyList = [];
        return;
      }
      const { data: res } = await this.$http.reqParamsList({
        cateId: this.cateId,
        sel: this.activeName,
      });
      if (res.meta.status !== 200) {
        let str = this.activeName === "many" ? "动态参数" : "静态属性";
        return this.$message.error(`获取${str}失败！`);
      }
      if (this.activeName === "many") {
        this.manyList = res.data.map((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          item.inputVisible = false;
          return item;
        });
      } else {
        this.onlyList = res.data.map((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
          item.inputVisible = false;
          return item;
        });
      }
    },
    // 页签点击事件
    handleTabClick() {
      this.cascaderChanged();
    },
    // 添加参数 ｜ 添加属性 按钮
    addBtn() {
      this.btnAction = '添加'
      this.addDialogVisible = true;
    },
    // 添加对话框确定按钮
    addDialogSubmit() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        const addInfo = {
          attr_name: this.addForm.attrName,
          attr_sel: this.activeName,
          cateId: this.cascaderValue[2]
        };
        if (this.btnAction === '编辑') { 
          addInfo.attrId = this.addForm.attrId
        }
        const { data: res } = await (
          this.btnAction === '添加' ?
          this.$http.reqAddAttr(addInfo) : 
          this.$http.reqEditAttr(addInfo)
        )
        if (res.meta.status !== 201 && res.meta.status !== 200) {
          return this.$message.error(`${this.btnAction + this.manyOrOnly}失败！`);
        }
        this.$message.success(`${this.btnAction + this.manyOrOnly}成功！`);
        this.cascaderChanged()
        this.addDialogVisible = false;
      });
    },
    // 添加对话框关闭回调
    addDialogClosed() {
      this.btnAction = ''
      this.addForm.attrId = ''
      this.$refs.addFormRef.resetFields();
    },
    // 属性标签关闭
    async handleClose(row, tag) {
      row.attr_vals.splice(row.attr_vals.indexOf(tag), 1);
      let attr_vals = row.attr_vals.join(",");
      const editInfo = {
        cateId: this.cascaderValue[2],
        attrId: row.attr_id,
        attr_name: row.attr_name,
        attr_sel: this.activeName,
        attr_vals,
      };
      const { data: res } = await this.$http.reqEditAttr(editInfo);
      if (res.meta.status !== 200) {
        return this.$message.error("属性值删除失败!");
      }
      this.$message.success("属性值删除成功!");
    },
    // 展示input
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.focus();
      });
    },
    // 输入框确定
    async handleInputConfirm(row) {
      let inputValue = this.inputValue;
      if (inputValue) {
        row.attr_vals.push(inputValue);
        let attr_vals = row.attr_vals.join(",");
        const editInfo = {
          cateId: this.cascaderValue[2],
          attrId: row.attr_id,
          attr_name: row.attr_name,
          attr_sel: this.activeName,
          attr_vals,
        };
        const { data: res } = await this.$http.reqEditAttr(editInfo);
        if (res.meta.status !== 200) {
          return this.$message.error("属性值添加失败!");
        }
        this.$message.success("属性值添加成功!");
      }
      row.inputVisible = false;
      this.inputValue = "";
    },
    // 编辑参数｜属性按钮
    editBtn(row) {
      this.btnAction = '编辑'
      this.addForm.attrId = row.attr_id
      this.addForm.attrName = row.attr_name
      this.addDialogVisible = true
    },
    // 删除参数｜属性按钮
    async deleteBtn(row) {
      const deleteResult = await this.$msgbox({
        title: '提示',
        message: `此操作将永久删除该${this.manyOrOnly}，确定要继续吗？`,
        type: 'warning',
        showCancelButton: true,
        showConfirmButton: true,
        showClose: false,
      }).catch(error => new Error(error))
      if (deleteResult === 'confirm') {
        const deleteInfo = {
          cateId: this.cascaderValue[2],
          attrId: row.attr_id
        }
        const { data: res } = await this.$http.reqDeleteAttr(deleteInfo)
        if (res.meta.status !== 200) {
          return this.$message.error(`删除${this.manyOrOnly}失败！`)
        }
        this.cascaderChanged()
        return this.$message.success(`删除${this.manyOrOnly}成功！`)
      }
      this.$message.info(`删除${this.manyOrOnly}操作已取消`)
    }
  },
};
</script>

<style lang='scss' scoped>
.selectCate {
  margin: 20px 0;
}
.el-tag {
  margin: 5px;
}
.button-new-tag {
  margin-left: 10px;
  height: 24px;
  line-height: 24px;
  padding-top: 0;
  padding-bottom: 0;
  border-radius: 4px;
}
.input-new-tag {
  width: 120px;
  margin-left: 10px;
}
</style>