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
          <el-button type="primary" @click="addRoleBtn">添加角色</el-button>
        </el-col>
      </el-row>

      <!-- 角色权限表格 -->
      <el-table :data="rolesList">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="item1 in scope.row.children"
              :key="item1.id"
              type="flex"
              align="middle"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <el-tag
                  size="medium"
                  type="danger"
                  closable
                  @close="deleteRightById(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  type="flex"
                  align="middle"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      @close="deleteRightById(scope.row, item2.id)"
                      size="small"
                      type="warning"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="success"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      size="mini"
                      closable
                      @close="deleteRightById(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" icon="el-icon-edit" type="success"
              >编辑</el-button
            >
            <el-button size="mini" icon="el-icon-delete" type="danger"
              >删除</el-button
            >
            <el-button
              size="mini"
              icon="el-icon-setting"
              type="warning"
              @click="setRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
    >
      <el-tree
        :data="rightsList"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultKeys"
        :props="rightsProps"
        ref="treeRef"
      ></el-tree>
      <div slot="footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightDialogConfirm"
          >确 定</el-button
        >
      </div>
    </el-dialog>

    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addRoleDialogVisible"
      @close="addRoleDialogClosed"
    >
      <el-form
        ref="addRoleFormRef"
        :model="addRoleInfo"
        label-width="80px"
        :rules="roleRules"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRoleInfo.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="addRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "Roles",
  data() {
    // 自定义用户角色校验规则
    var checkRoleName = (rule, value, callback) => {
      setTimeout(() => {
        const roleArr = this.rolesList.map((item) => item.roleName);
        let roleIsHave = roleArr.includes(value);
        if (roleIsHave) {
          return callback(new Error("该角色名已被占用"));
        }
        callback()
      });
    };
    return {
      rolesList: [],
      setRightDialogVisible: false,
      type: "tree",
      rightsList: [],
      rightsProps: {
        label: "authName",
        children: "children",
      },
      // 默认选中的节点ID
      defaultKeys: [],
      // 当前分配权限角色id
      roleId: "",
      addRoleInfo: {
        roleName: "",
        roleDesc: "",
      },
      addRoleDialogVisible: false,
      // 角色规则
      roleRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { validator: checkRoleName, trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.reqGetRolesList();
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesList = res.data;
    },
    // 收集默认选中节点列表id
    getDefaultKeys(node, arr) {
      if (!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach((item) => {
        this.getDefaultKeys(item, arr);
      });
      return arr;
    },
    // 分配权限对话框按钮
    async setRightDialog(roleInfo) {
      this.roleId = roleInfo.id;
      const { data: res } = await this.$http.reqGetRightsList(this.type);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      }
      this.rightsList = res.data;
      this.defaultKeys = this.getDefaultKeys(roleInfo, []);
      this.setRightDialogVisible = true;
    },
    // 提交分配好的权限
    async setRightDialogConfirm() {
      const rightKeys = this.$refs.treeRef
        .getCheckedKeys()
        .concat(this.$refs.treeRef.getHalfCheckedKeys());
      let rids = rightKeys.join(",");
      const { data: res } = await this.$http.reqRoleAuth(this.roleId, rids);
      if (res.meta.status !== 200) {
        return this.$message.error("权限分配失败！");
      }
      this.$message.success("权限分配成功！");
      this.setRightDialogVisible = false;
      this.getRolesList();
    },
    // 删除角色指定权限
    async deleteRightById(roleInfo, rightId) {
      const delResult = await this.$msgbox({
        title: "提示",
        message: "此操作将永久删除该权限，确认要继续吗？",
        type: "warning",
        showClose: false,
        showCancelButton: true,
        showConfirmButton: true,
      }).catch((error) => new Error(error));
      if (delResult === "confirm") {
        const { data: res } = await this.$http.reqDeleteRightById(
          roleInfo.id,
          rightId
        );
        if (res.meta.status !== 200) {
          return this.$message.error("权限删除失败！");
        }
        roleInfo.children = res.data;
        return this.$message.success("权限删除成功！");
      }
      this.$message.info("权限删除已取消！");
    },
    // 添加角色按钮
    addRoleBtn() {
      this.addRoleDialogVisible = true;
    },
    // 添加角色提交
    addRoleSubmit() {
      this.$refs.addRoleFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.reqAddRole(this.addRoleInfo)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        this.$message.success('添加角色成功！')
        this.getRolesList()
        this.addRoleDialogVisible = false;
      })
    },
    // 添加角色对话框关闭
    addRoleDialogClosed() {
      this.$refs.addRoleFormRef.resetFields()
    }
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  margin-top: 20px;
  .el-row {
    border-bottom: 1px dashed #eee;
    &:last-child {
      border: none;
    }
    .el-tag {
      margin: 10px;
    }
  }
}
</style>