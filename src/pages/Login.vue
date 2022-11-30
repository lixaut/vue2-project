<template>
  <div class="login-container">
    <div class="login-box">
      <h2>登录</h2>
      <!-- 登录表单 -->
      <el-form ref="loginFormRef" class="login-form" :model="loginForm" :rules="rules">
        <el-form-item prop="username">
          <el-input 
            prefix-icon="el-icon-user" 
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            show-password 
            prefix-icon="el-icon-lock" 
            v-model="loginForm.password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入用户姓名',
            trigger: 'blur'
          }
        ],
        password: [
          {
            required: true,
            message: '请输入登录密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 8,
            message: '长度在 6 到 8 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    // 表单重置
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    // 登录
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.login(this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败!')
        this.$message({
          message: '登录成功!',
          type: 'success'
        })
        console.log(res)
        sessionStorage.setItem('token', res.data.token)
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    background-color: #2b4b6b;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    h2 {
      padding-left: 20px;
    }
    .login-box {
      width: 450px;
      height: 260px;
      background-color: #fff;
      border-radius: 10px;
      .login-form {
        width: 100%;
        padding: 0 20px;
        .btns {
          display: float;
          float: right;
        }
      }
    }
  }
</style>