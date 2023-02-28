<template>
  <div id="LoginContain">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" height="100%" width="100%" />
      </div>

      <!-- elementUI的表单 -->
      <el-form class="form" :model="LoginForm" :rules="rules" ref="LoginFormRef" label-width="0px" style="width: 100%; padding: 10%" size="large">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="LoginForm.username" prefix-icon="el-icon-user-solid"></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input type="password" v-model="LoginForm.password" prefix-icon="el-icon-lock"></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btn">
          <el-button type="primary" @click='login'>登录</el-button>
          <el-button type="info" @click='reset'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      LoginForm: {
        username: '',
        password: ''
      },
      rules: {
        // 注意这里的名字要跟data里面的对应
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度为3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度为3-10个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onSubmit () {
      // console.log('submit!')
    },
    reset () {
      this.$refs.LoginFormRef.resetFields()
    },
    login () {
      // 预校验方法 里面是一个回调函数
      this.$refs.LoginFormRef.validate(async valid => {
        if (!valid) return false
        else {
          const { data: res } = await this.$http.post('login', this.LoginForm)
          if (res.meta.status !== 200) {
            this.$message.error('用户名或密码错误')
          }
          if (res.meta.status === 200) {
            this.$message.success('登录成功')
            // console.log(res)
            // 登录成功后保存token到本地 方便后续管理登录状态
            window.sessionStorage.setItem('token', res.data.token)
            // const token = window.sessionStorage.getItem('token')
            // 登录成功后跳转到后台页面
            this.$router.push('/home')
          }
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
#LoginContain {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
}
.login_box {
  width: 40%;
  height: 45%;
  background-color: white;
  border-radius: 3%;

  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  //头像盒子
  .avatar_box {
    position: absolute;
    top: -20%;
    width: 25%;
    height: 40%;
    background-color: white;
    border-radius: 50%;
    border: 1px #eee solid;
    overflow: hidden;
    padding: 1.5%;
    box-shadow: 0 0 10px #eee;
    img {
      border-radius: 50%;
      background-color: #eee;
    }
  }

  // 表格和按钮盒子
  .form {
    width: 100%;
    height: 40%;
    overflow: hidden;
    transform: translateY(15%);
    // 按钮盒子
    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
