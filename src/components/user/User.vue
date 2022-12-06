<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片 -->
    <el-card>
      <!-- 卡片头部功能 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addUserDialogVisable = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList" border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row.id, scope.row.mg_state)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="success"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="showDeleteDialog(scope.row)"
            ></el-button>
            <!-- 分配角色 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setUserRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页器 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="jumper , prev, pager, next, ->, sizes, total"
        :total="total"
      ></el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addUserDialogVisable"
      width="50%"
      @close="addUserDialogClosed"
    >
      <el-form
        :model="addUserInfo"
        :rules="addUserRules"
        ref="addUserRef"
        label-width="80px"
        status-icon
      >
        <el-form-item label="用户名称" prop="username">
          <el-input v-model="addUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="addUserInfo.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addUserDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="addUserConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      width="50%"
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      @close="editDialogClosed"
    >
      <el-form
        :model="editUserInfo"
        label-width="80px"
        :rules="addUserRules"
        ref="editUserRef"
        status-icon
      >
        <el-form-item label="用户名">
          <el-input disabled v-model="editUserInfo.username"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editUserInfo.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editUserInfo.mobile"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editDialogConfirm">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配用户角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      @close="setRoleDialogClesed"
    >
      <div class="setRole">
        当前用户：<span>{{setRoleInfo.username}}</span>
      </div>
      <div class="setRole">
        当前角色：<span>{{setRoleInfo.role_name}}</span>
      </div>
      <span>请选择新角色：</span>
      <el-select v-model="newRoleId" placeholder="请选择">
        <el-option 
          v-for="item in roleList" 
          :key="item.id"
          :label="item.roleName"
          :value="item.id"
          :disabled="item.roleName === setRoleInfo.role_name"
        ></el-option>
      </el-select>
      <div slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRoleSubmit"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "User",
  data() {
    // 邮箱验证规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法邮箱地址"));
    };
    // 手机号验证规则
    var checkMobile = (rule, value, callback) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return callback();
      }
      callback(new Error("请输入合法手机号"));
    };
    return {
      // 获取用户列表参数
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 2,
      },
      // 用户列表数据
      userList: [],
      total: 0,
      // 添加用户对话框
      addUserDialogVisable: false,
      // 修改用户对话框
      editDialogVisible: false,
      // 分配角色对话框
      setRoleDialogVisible: false,
      // 添加用户信息
      addUserInfo: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户验证规则
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入用户密码", trigger: "blur" },
          { min: 6, max: 8, message: "长度在 6 到 8 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 修改用户信息
      editUserInfo: {},
      // 分配用户角色信息
      setRoleInfo: {},
      // 角色列表
      roleList: [],
      newRoleId: ''
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      const { data: res } = await this.$http.reqGetUserList(this.queryInfo);
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 改变每页条数回调
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 改变当前页回调
    handleCurrentChange(newCurrentPage) {
      this.queryInfo.pagenum = newCurrentPage;
      this.getUserList();
    },
    // 修改用户状态回调
    async userStateChanged(uId, type) {
      const { data: res } = await this.$http.reqUpdateUserState(uId, type);
      if (res.meta.status !== 200) {
        return this.$message.error("设置状态失败");
      }
      this.$message({ message: res.meta.msg, type: "success" });
    },
    // 添加用户对话框关闭回调
    addUserDialogClosed() {
      this.$refs.addUserRef.resetFields();
    },
    // 添加用户确定按钮
    addUserConfirm() {
      this.$refs.addUserRef.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.reqAddUser(this.addUserInfo);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败!");
        }
        this.$message.success("添加用户成功!");
        this.addUserDialogVisable = false;
        this.getUserList();
      });
    },
    // 修改用户对话框
    showEditDialog(userInfo) {
      this.editDialogVisible = true;
      const { username, email, mobile, id } = userInfo;
      this.editUserInfo = { username, email, mobile, id };
    },
    // 修改用户对话框关闭回调
    editDialogClosed() {
      this.$refs.editUserRef.resetFields();
    },
    // 修改用户确定按钮
    editDialogConfirm() {
      this.$refs.editUserRef.validate(async (valid) => {
        if (!valid) return;
        const { id, email, mobile } = this.editUserInfo;
        const { data: res } = await this.$http.reqEditUser({
          id,
          email,
          mobile,
        });
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户信息失败！");
        }
        this.$message.success("修改用户信息成功！");
        this.getUserList();
        this.editDialogVisible = false;
      });
    },
    // 删除用户弹出框
    showDeleteDialog(userInfo) {
      const { username, id } = userInfo;
      this.$msgbox({
        title: "提示",
        message: `此操作将永久删除该用户（${username}），确定继续吗？`,
        type: "warning",
        showCancelButton: true,
        showConfirmButton: true,
        closeOnClickModal: false,
        showClose: false,
        callback: async (action, msgBox) => {
          if (action == "confirm") {
            const { data: res } = await this.$http.reqDeleteUser(id);
            if (res.meta.status !== 200) {
              return this.$message.error("删除用户失败！");
            }
            this.getUserList();
            return this.$message.success("删除用户成功！");
          }
          this.$message.info("删除用户已取消！");
        },
      });
    },
    // 分配用户角色
    async setUserRole(userInfo) {
      const { data: res } = await this.$http.reqGetRolesList()
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.roleList = res.data
      const { id, username, role_name } = userInfo
      this.setRoleInfo = { username, role_name, id}
      this.setRoleDialogVisible = true
    },
    // 提交分配角色
    async setRoleSubmit() {
    const { id: userId } = this.setRoleInfo
      const { data: res } = await this.$http.reqSetUserRole({
        userId,
        roleId: this.newRoleId
      })
      if (res.meta.status !== 200) {
        return this.$message.error('分配角色失败！')
      }
      this.$message.success('分配角色成功！')
      this.getUserList()
      this.setRoleDialogVisible = false
    },
    // 分配角色对话框关闭回调
    setRoleDialogClesed() {
      this.newRoleId = ''
    }
  },
};
</script>

<style lang="scss" scoped>
.el-table {
  margin: 20px 0;
}
.setRole {
  padding: 8px 0;
}
</style>