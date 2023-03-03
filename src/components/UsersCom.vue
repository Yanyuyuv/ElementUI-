<template>
  <div class="usersContainer">
    <div class="breadCrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :gutter="20">
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="search"
            clearable
          >
            <el-button
              @click="searchBtn"
              slot="append"
              icon="el-icon-search"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addFormDialogVisible = true"
            >添加用户</el-button
          >

          <!-- 添加用户对话框弹窗 -->
          <el-dialog
            title="添加用户"
            :visible.sync="addFormDialogVisible"
            width="50%"
            center
            :show-close="false"
          >
            <el-form
              label-width="65px"
              ref="addFormRef"
              :rules="addFormRules"
              :model="addForm"
            >
              <el-form-item label="用户名" prop="username">
                <el-input v-model="addForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="addForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="addForm.email"></el-input>
              </el-form-item>
              <el-form-item label="手机" prop="mobile">
                <el-input v-model="addForm.mobile"></el-input>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="resetForm('addForm')">取 消</el-button>
              <el-button type="primary" @click="postAddForm">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <el-table :data="userList" style="width: 100%" stripe border>
        <el-table-column prop="id" label="ID"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 注意下面的写法 -->
        <!-- 下面的写法文档没写 可以认识一下 -->
        <el-table-column label="状态" prop="mg_status">
          <!-- template是放插槽的地方 -->
          <template slot-scope="scope">
            <!-- {{ scope.row }} -->
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#13ce66"
              inactive-color="#ff4949"
              @change="statusChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 通过插槽自定义这一栏的数据 -->
        <el-table-column label="操作" width="175">
          <!-- template是插槽 -->
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改信息"
              placement="top-end"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="changeFormBtn(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="删除"
              placement="top"
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="deleteFormBtn(scope.row)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top-start"
            >
              <el-button
                type="warning"
                icon="el-icon-user-solid"
                size="mini"
                @click="changeRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑用户信息对话框弹窗 -->
      <el-dialog
        title="编辑信息"
        :visible.sync="changeFormDialogVisible"
        width="50%"
        center
        :show-close="false"
      >
        <el-form
          label-width="65px"
          ref="changeFormRef"
          :rules="addFormRules"
          :model="changeForm"
        >
          <el-form-item label="用户名">
            <el-input disabled v-model="changeForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="changeForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="changeForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('changeForm')">取 消</el-button>
          <el-button type="primary" @click="postChangeForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 删除按钮确认对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="deleteDialogVisible"
        width="30%"
        center
        :show-close="false"
      >
        <span>确定要删除该用户？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteFormCheck">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配角色对话框弹窗 -->
      <el-dialog
        title="分配角色"
        :visible.sync="changeRoleDialogVisible"
        width="50%"
        center
        :show-close="false"
      >
        <el-form
          label-width="100px"
          ref="roleFormRef"
          :rules="addFormRules"
          :model="roleForm"
        >
          <el-form-item label="用户名">
            <el-input disabled v-model="roleForm.username"></el-input>
          </el-form-item>
          <el-form-item label="当前角色">
            <el-input disabled v-model="roleForm.nowRoleName"></el-input>
          </el-form-item>
          <el-form-item label="分配角色">
            <el-select v-model="roleForm.rid" placeholder="请选择角色">
              <el-option
                v-for="option in rolesList"
                :key="option.id"
                :label="option.roleName"
                :value="option.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('roleForm')">取 消</el-button>
          <el-button type="primary" @click="postRoleForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 搜索栏目 -->
      <!-- @改变每页显示数量 -->
      <!-- @改变页码 -->
      <!-- 当前页码 -->
      <!-- 每页显示数量 -->
      <!-- layout：下拉显示菜单 -->
      <!-- total:总数 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    // 表格的自定义验证
    const checkEmail = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入邮箱'))
      }
      const regEmail =
        /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      } else {
        return callback(new Error('请输入合法邮箱'))
      }
    }
    const checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入电话'))
      }
      const regMobile =
        /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        // 合法电话
        return callback()
      } else {
        return callback(new Error('请输入合法电话'))
      }
    }
    return {
      // 用户列表需要参数
      queryInfo: {
        query: '', // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 10 // 每页显示条数
      },
      // 添加用户表单
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      addFormRules: {
        // 注意这里的名字要跟data里面的对应
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度为3-10个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 3, max: 10, message: '长度为3-10个字符', trigger: 'blur' }
        ],
        email: [
          {
            required: true,
            validator: checkEmail,
            trigger: 'blur'
          }
        ],
        mobile: [
          {
            required: true,
            validator: checkMobile,
            trigger: 'blur'
          }
        ]
      },
      // 编辑信息表单
      changeForm: {
        id: '',
        username: '',
        email: '',
        mobile: ''
      },
      // 分配角色表单
      roleForm: {
        id: '',
        rid: '',
        username: '',
        nowRoleName: ''
      },
      // 删除用户的ID
      deleteID: 0,
      userList: [],
      rolesList: [],
      total: 0,
      search: '', // 搜索框
      addFormDialogVisible: false, // 添加用户对话框
      changeFormDialogVisible: false, // 编辑用户信息对话框
      deleteDialogVisible: false, // 删除确认弹窗
      changeRoleDialogVisible: false // 分配角色弹窗
    }
  },
  created () {
    // 获取用户列表
    this.getUserList()
  },
  methods: {
    // 获取用户信息
    async getUserList () {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo
      })
      // 获取失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      // console.log(res)
      // 获取成功
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      // 获取失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败')
      }
      // console.log(res)
      // 获取成功
      this.rolesList = res.data
      // console.log(this.rolesList)
    },
    // 搜索按钮
    async searchBtn () {
      // console.log(this.search)
      // console.log(this.userList)
      // 别人的接口没有搜索接口 要自己 用过滤器写
      // const { data: res } = await this.$http.get(`users/${this.search}`)
      // console.log(res)
      // if (res.meta.status !== 200) {
      //   // 不成功就把前台的state改回去
      //   return this.$message.error('未找到该ID用户！')
      // }
      // console.log(this.userList)
      return this.$message.error('后台查询接口未完善，后续更新')
    },
    // 改变状态
    async statusChange (userinfo) {
      // console.log(userinfo)
      // 传参给服务器改变状态
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        // 不成功就把前台的state改回去
        userinfo.mg_state = !userinfo.mg_state
        return this.$message.error('修改失败！')
      }
      // console.log(res)
    },
    // 改变页码
    handleSizeChange (newSize) {
      // 改变每页显示数量
      // 重新发起数据请求 改变queryInfo拿数据

      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (newPage) {
      // 改变页码
      // 重新发起数据请求 改变queryInfo拿数据
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },
    // 添加用户重置
    resetForm (formName) {
      if (formName === 'addForm') {
        this.$refs.addFormRef.resetFields()
        this.addFormDialogVisible = false
      }
      if (formName === 'changeForm') {
        this.$refs.changeFormRef.resetFields()
        this.changeFormDialogVisible = false
      }
      if (formName === 'roleForm') {
        this.$refs.roleFormRef.resetFields()
        this.changeRoleDialogVisible = false
      }
      // this.$refs.Ref.resetFields()
      // this.$refs.addFormRef.resetFields()
      // this.addFormDialogVisible = false
    },
    // 编辑用户信息按钮
    changeFormBtn (row) {
      this.changeFormDialogVisible = true
      this.changeForm.username = row.username
      this.changeForm.id = row.id
      // console.log(this.changeForm)
    },
    // 删除表单按钮
    deleteFormBtn (row) {
      this.deleteDialogVisible = true
      this.deleteID = row.id
    },
    // 确认删除按钮
    async deleteFormCheck () {
      this.deleteDialogVisible = false
      // 传参给服务器删除用户
      const { data: res } = await this.$http.delete(`users/${this.deleteID}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      } else {
        // console.log(res)
        // 创建成功： 关闭对话框 弹窗 更新用户数据
        this.deleteDialogVisible = false
        this.$message.success('删除成功')
        this.getUserList()
      }
    },
    // 分配角色按钮
    changeRole (row) {
      this.getRolesList()
      // console.log(row)
      this.roleForm.id = row.id // 角色ID
      this.roleForm.username = row.username
      this.roleForm.nowRoleName = row.role_name
      this.roleForm.rid = ''
      this.changeRoleDialogVisible = true
      // console.log(row)
    },
    postAddForm () {
      this.$refs.addFormRef.validate(async (bollean, object) => {
        if (bollean !== true) {
          this.$message.error('请正确完成表格')
        }
        if (bollean === true) {
          const { data: res } = await this.$http.post('users', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error('修改失败！')
          } else {
            // console.log(res)
            // 创建成功： 关闭对话框 弹窗 更新用户数据
            this.addFormDialogVisible = false
            this.$message.success('创建成功')
            this.getUserList()
          }
        }
      })
    },
    postChangeForm () {
      this.$refs.changeFormRef.validate(async (bollean, object) => {
        if (bollean !== true) {
          this.$message.error('请正确完成表格')
        }
        if (bollean === true) {
          // 传参给服务器修改信息
          const { data: res } = await this.$http.put(
            `users/${this.changeForm.id}`,
            this.changeForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error('修改失败！')
          } else {
            // console.log(res)
            // 创建成功： 关闭对话框 弹窗 更新用户数据
            this.changeFormDialogVisible = false
            this.$message.success('修改成功')
            this.getUserList()
          }
          // console.log(res)
          // const { data: res } = await this.$http.post('users', this.addForm)
          // if (res.meta.status !== 201) {
          //   return this.$message.error('修改失败！')
          // } else {
          //   // console.log(res)
          //   // 创建成功： 关闭对话框 弹窗 更新用户数据
          //   this.addFormDialogVisible = false
          //   this.$message.success('创建成功')
          //   this.getUserList()
          // }
        }
      })
    },
    // 分配角色请求
    async postRoleForm () {
      // console.log(this.roleForm.rid)
      if (this.roleForm.roleName === '') {
        this.$message.error('请正确完成表格')
      } else {
        // 传参给服务器修改信息
        const { data: res } = await this.$http.put(
          `users/${this.roleForm.id}/role`,
          {
            rid: this.roleForm.rid
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        } else {
          // console.log(res)
          // 创建成功： 关闭对话框 弹窗 更新用户数据
          this.changeRoleDialogVisible = false
          this.$message.success('分配成功')
          this.getUserList()
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
</style>
