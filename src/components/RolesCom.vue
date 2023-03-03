<template>
  <!-- // 大部分复用user组件代码 -->
  <div class="usersContainer">
    <div class="breadCrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>角色列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加角色按钮 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addFormDialogVisible = true"
            >添加角色</el-button
          >

          <!-- 添加角色对话框弹窗 -->
          <el-dialog
            title="添加角色"
            :visible.sync="addFormDialogVisible"
            width="50%"
            center
            :show-close="false"
          >
            <el-form
              label-width="80px"
              ref="addFormRef"
              :rules="addFormRules"
              :model="addForm"
            >
              <el-form-item label="角色名" prop="roleName">
                <el-input v-model="addForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="角色描述">
                <el-input
                  v-model="addForm.roleDesc"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                ></el-input>
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
      <el-table :data="rolesList" style="width: 100%" stripe border>
        <!-- 下拉菜单 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格布局 el-row -->
            <el-row
              class="powerTagLeft"
              v-for="power1 in scope.row.children"
              :key="power1.id"
            >
              <!-- ！！！注意 下面的用power1表示每一个一级权限 -->
              <!-- 一级权限 最左边 -->
              <el-col :span="5">
                <el-tag
                  :key="power1.id"
                  closable
                  @close="tagClose(scope.row, power1.id)"
                >
                  {{ power1.authName }}
                </el-tag>
                <i
                  v-if="power1.children.length"
                  class="el-icon-caret-right powerTagIcon"
                ></i>
              </el-col>
              <!-- 二级权限和三级权限 -->
              <el-col :span="19">
                <el-row
                  class="powerTagRight"
                  v-for="power2 in power1.children"
                  :key="power2.id"
                >
                  <!-- ！！！注意 下面的用power表示每一个二级权限 -->
                  <!-- 二级标签 -->
                  <el-col :span="9">
                    <el-tag
                      class="powerTag2"
                      type="success"
                      :key="power2.id"
                      closable
                      @close="tagClose(scope.row, power2.id)"
                    >
                      {{ power2.authName }}
                    </el-tag>
                    <i
                      v-if="power2.children.length"
                      class="el-icon-caret-right powerTagIcon"
                    ></i>
                  </el-col>
                  <!-- 三级标签 -->
                  <el-col class="powerTag3Container" :span="15">
                    <el-tag
                      class="powerTag3"
                      type="warning"
                      v-for="power3 in power2.children"
                      :key="power3.id"
                      closable
                      @close="tagClose(scope.row, power3.id)"
                    >
                      {{ power3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!--
            <pre>
              {{ scope.row }}
            </pre> -->
          </template>
        </el-table-column>
        <el-table-column prop="id" label="ID" width="60"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <!-- 通过插槽自定义这一栏的数据 -->
        <el-table-column label="操作" width="300">
          <!-- template是插槽 -->
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="修改信息"
              placement="top"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="changeFormBtn(scope.row)"
                >编辑</el-button
              >
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
                >删除</el-button
              >
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top"
            >
              <el-button
                @click="powerBtn(scope.row)"
                type="warning"
                icon="el-icon-user-solid"
                size="mini"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑用户信息对话框弹窗 -->
      <el-dialog
        title="修改信息"
        :visible.sync="changeFormDialogVisible"
        width="50%"
        center
        :show-close="false"
      >
        <el-form
          label-width="80px"
          ref="changeFormRef"
          :rules="addFormRules"
          :model="changeForm"
        >
          <el-form-item label="ID">
            <el-input disabled v-model="changeForm.id"></el-input>
          </el-form-item>
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="changeForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述">
            <el-input
              v-model="changeForm.roleDesc"
              type="textarea"
              :autosize="{ minRows: 2, maxRows: 4 }"
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('changeForm')">取 消</el-button>
          <el-button type="primary" @click="postChangeForm">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 角色删除按钮确认对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="deleteDialogVisible"
        width="30%"
        center
        :show-close="false"
      >
        <span>确定要删除该角色？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteFormCheck">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="powerDialogVisible"
        width="30%"
        center
        :show-close="false"
        @close="closePower"
      >
        <el-tree
          :data="rightsList"
          show-checkbox
          node-key="id"
          ref="tree"
          :props="treeProps"
          :default-checked-keys="this.defKeys"
        >
        </el-tree>

        <span slot="footer" class="dialog-footer">
          <el-button @click="powerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="postPower">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 权限标签删除按钮确认对话框 -->
      <el-dialog
        title="提示"
        :visible.sync="deleteTagDialogVisible"
        width="30%"
        center
        :show-close="false"
      >
        <span>确定要删除该权限？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="deleteTagDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="deleteTagCheck">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: [],
      treeProps: {
        children: 'children', // 用children指定分页下面显示什么
        label: 'authName' // 用label指定每个标签的名字
      },

      // 添加角色表单
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addFormRules: {
        // 注意这里的名字要跟data里面的对应
        roleName: [
          { required: true, message: '请输入角色', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1-10个字符', trigger: 'blur' }
        ]
      },
      // 编辑信息表单
      changeForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      // 删除角色的ID
      deleteID: 0,
      // 删除标签的ID
      deleteTagID: 0,
      rolesList: [],
      addFormDialogVisible: false, // 添加用户对话框
      changeFormDialogVisible: false, // 编辑用户信息对话框
      deleteDialogVisible: false, // 角色删除确认弹窗
      deleteTagDialogVisible: false, // 标签删除确认弹窗
      powerDialogVisible: false, // 分配权限弹窗
      powerID: 0, // 分配权限的ID
      defKeys: [] // 分配权限对话框的默认选项
    }
  },
  created () {
    // 获取角色列表
    this.getRolesList()
  },
  methods: {
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
      this.total = this.rolesList.length
    },
    // 获取权限列表
    async getRightsList () {
      // 获取菜单数据
      const { data: res } = await this.$http.get('rights/tree')
      // 获取失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 获取成功
      this.rightsList = res.data
      // console.log(this.rightsList)
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
      const { data: res } = await this.$http.delete(`roles/${this.deleteID}`)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      } else {
        // console.log(res)
        // 创建成功： 关闭对话框 弹窗 更新用户数据
        this.deleteDialogVisible = false
        this.$message.success('删除成功')
        this.getRolesList()
      }
    },
    // 分配权限按钮
    powerBtn (row) {
      this.getRightsList() // 获取权限列表 用于渲染对话框
      this.powerDialogVisible = true // 展示对话框
      this.powerID = row.id // 记录点击的ID

      // 先清空defKeys
      this.defKeys = []
      // 过去该ID的所有菜单ID 进行对话框的默认选择
      // 递归记录ID 到defKeys
      // 从row.children开始就是拥有的权限
      // !!!只要遍历第三层就可以了
      if (row.children) {
        // console.log(row.children)
        // 遍历第一层权限
        for (const first in row.children) {
          // console.log(first)
          // console.log(row.children[first])
          // console.log(row.children[first].id)
          // this.defKeys.push(row.children[first].id)
          // 遍历第二层权限
          for (const second in row.children[first].children) {
            // console.log(second)
            // console.log(row.children[first].children[second])
            // console.log(row.children[first].children[second].id)
            // this.defKeys.push(row.children[first].children[second].id)
            // 遍历第三层权限
            for (const third in row.children[first].children[second].children) {
              // console.log(third)
              // console.log(row.children[first].children[second].children[third])
              // console.log(
              //   row.children[first].children[second].children[third].id
              // )
              this.defKeys.push(
                row.children[first].children[second].children[third].id
              )
              // 遍历第三层权限
            }
          }
        }
      }
      // console.log(this.defKeys)
    },
    // 分配权限对话框关闭事件
    closePower () {
      // console.log(1)
      this.defKeys = []
    },
    postAddForm () {
      this.$refs.addFormRef.validate(async (bollean, object) => {
        if (bollean !== true) {
          this.$message.error('请正确完成表格')
        }
        if (bollean === true) {
          // 更改为添加角色
          const { data: res } = await this.$http.post('roles', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error('添加失败！')
          } else {
            // console.log(res)
            // 创建成功： 关闭对话框 弹窗 更新用户数据
            this.addFormDialogVisible = false
            this.$message.success('添加成功')
            this.getRolesList()
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
            `roles/${this.changeForm.id}`,
            this.changeForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error('修改失败！')
          } else {
            // console.log(res)
            // 创建成功： 关闭对话框 弹窗 更新用户数据
            this.changeFormDialogVisible = false
            this.$message.success('修改成功')
            this.getRolesList()
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
          // }
        }
      })
    },
    // 角色授权
    async postPower () {
      // console.log('要开始找服务器分配权限了')
      // ！！！！！通过请求体发送参数
      const keys = this.$refs.tree.getCheckedKeys()
      const idStr = keys.join(',')
      // console.log(keys)
      // console.log(idStr)
      if (keys === '') {
        this.$message.error('请正确完成表格')
      } else {
        // 更改为添加角色
        const { data: res } = await this.$http.post(
          `roles/${this.powerID}/rights`,
          { rids: idStr }
        )
        // console.log(res)
        if (res.meta.status !== 200) {
          return this.$message.error('分配失败！')
        } else {
          // 创建成功： 关闭对话框 弹窗 更新用户数据
          this.powerDialogVisible = false
          this.$message.success('分配成功')
          this.getRolesList()
        }
      }
    },
    // 标签删除按钮
    tagClose (row, Tagid) {
      // 记录角色ID和权限ID
      // console.log(row.id)
      this.deleteID = row.id
      this.deleteTagID = Tagid
      // this.deleteTagDialogVisible = true
      this.$confirm('确定要删除该权限？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 请求删除权限
          // console.log('确认')
          this.deleteTagDialogVisible = false
          // 传参给服务器删除用户
          const { data: res } = await this.$http.delete(
            `roles/${row.id}/rights/${Tagid}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          } else {
            // console.log(res)
            // 创建成功： 关闭对话框 弹窗 更新用户数据
            this.deleteTagDialogVisible = false
            this.$message.success('删除成功')
            // 获取最新权限数据
            // this.getRolesList()//这么写会导致菜单刷新 体验不好\
            row.children = res.data
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 确认删除标签
    async deleteTagCheck () {}
  }
}
</script>

<style lang="less" scoped>
//权限标签栅格布局
.powerTagLeft {
  border-top: 1px rgb(218, 222, 230) solid;
  margin: 0 5%; //左右
  display: flex;
  align-items: center;
}
.powerTagRight {
  padding: 1% 0%; //上下
  display: flex;
  align-items: center;
}
.powerTagRight:not(:first-child) {
  border-top: 1px rgb(218, 222, 230) solid;
}
.el-tag {
  user-select: none;
}
.powerTagLeft:last-child {
  border-bottom: 1px rgb(218, 222, 230) solid;
}
//权限标签右边的小箭头
.powerTagIcon {
  margin-left: 10px;
}

.powerTag3 {
  margin: 1% 0;
  margin-right: 20px;
}
</style>
