<template>
  <div class="GoodsCateContainer">
    <!-- 面包屑 -->
    <div class="breadCrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>商品分类</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 添加分类按钮 -->
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="addCateBtn">添加分类</el-button>

          <!-- 添加角色对话框弹窗 -->
          <el-dialog
            title="添加分类"
            :visible.sync="addCateDialogVisible"
            width="50%"
            center
            :show-close="false"
          >
            <el-form
              label-width="80px"
              ref="cateFormRef"
              :rules="cateFormRules"
              :model="cateForm"
            >
              <el-form-item label="分类名称" prop="cat_name">
                <el-input
                  v-model="cateForm.cat_name"
                  placeholder="请输入分类名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="父级分类">
                <el-cascader
                  :options="addCateList"
                  :props="cascaderSet"
                  v-model="addCateValue"
                  clearable
                  @change="handleChange"
                  placeholder="请选择 无选择则表示一级分类"
                ></el-cascader>
              </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
              <el-button @click="resetForm('cateForm')">取 消</el-button>
              <el-button type="primary" @click="postCateForm">确 定</el-button>
            </span>
          </el-dialog>
        </el-col>
      </el-row>

      <!-- 表格 -->
      <!-- 表格 -->
      <el-table :data="cateList" style="width: 100%" stripe border>
        <el-table-column prop="cat_id" label="类别ID" width="80">
        </el-table-column>
        <!-- 下拉菜单 -->
        <el-table-column type="expand" width="50">
          <template slot-scope="scope">
            <el-table
              :data="scope.row.children"
              style="width: 100%; border: 2px solid lightgreen"
              stripe
              border
            >
              <el-table-column prop="cat_id" label="类别ID" width="80">
              </el-table-column>
              <!-- 下拉菜单 -->
              <el-table-column type="expand" width="50">
                <template slot-scope="scope">
                  <el-table
                    :data="scope.row.children"
                    style="width: 100%; border: 2px solid orange"
                    stripe
                    border
                  >
                    <el-table-column prop="cat_id" label="类别ID" width="80">
                    </el-table-column>
                    <!-- 下拉菜单 -->
                    <el-table-column width="50"> </el-table-column>
                    <el-table-column prop="cat_name" label="分类名称">
                    </el-table-column>
                    <el-table-column prop="cat_deleted" label="是否有效">
                      <i
                        v-if="!cateList.cat_deleted"
                        class="el-icon-success"
                        style="color: lightgreen"
                      ></i>
                      <i
                        v-if="cateList.cat_deleted"
                        class="el-icon-error"
                        style="color: red"
                      ></i>
                    </el-table-column>
                    <el-table-column prop="cat_level" label="排序">
                      <template slot-scope="scope">
                        <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                        <el-tag v-if="scope.row.cat_level == 1" type="success"
                          >二级</el-tag
                        >
                        <el-tag v-if="scope.row.cat_level == 2" type="warning"
                          >三级</el-tag
                        >
                      </template>
                    </el-table-column>
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
                            @click="changeCateFormBtn(scope.row)"
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
                            @click="deleteCateFormBtn(scope.row)"
                            >删除</el-button
                          >
                        </el-tooltip>
                      </template>
                    </el-table-column>
                  </el-table>
                </template>
              </el-table-column>
              <el-table-column prop="cat_name" label="分类名称">
              </el-table-column>
              <el-table-column prop="cat_deleted" label="是否有效">
                <i
                  v-if="!cateList.cat_deleted"
                  class="el-icon-success"
                  style="color: lightgreen"
                ></i>
                <i
                  v-if="cateList.cat_deleted"
                  class="el-icon-error"
                  style="color: red"
                ></i>
              </el-table-column>
              <el-table-column prop="cat_level" label="排序">
                <template slot-scope="scope">
                  <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
                  <el-tag v-if="scope.row.cat_level == 1" type="success"
                    >二级</el-tag
                  >
                  <el-tag v-if="scope.row.cat_level == 2" type="warning"
                    >三级</el-tag
                  >
                </template>
              </el-table-column>
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
                      @click="changeCateFormBtn(scope.row)"
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
                      @click="deleteCateFormBtn(scope.row)"
                      >删除</el-button
                    >
                  </el-tooltip>
                </template>
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column prop="cat_name" label="分类名称"> </el-table-column>
        <el-table-column prop="cat_deleted" label="是否有效">
          <i
            v-if="!cateList.cat_deleted"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i
            v-if="cateList.cat_deleted"
            class="el-icon-error"
            style="color: red"
          ></i>
        </el-table-column>
        <el-table-column prop="cat_level" label="排序">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.cat_level == 0">一级</el-tag>
            <el-tag v-if="scope.row.cat_level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.cat_level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
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
                @click="changeCateFormBtn(scope.row)"
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
                @click="deleteCateFormBtn(scope.row)"
                >删除</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 编辑用户信息对话框弹窗 -->
      <el-dialog
        title="编辑分类"
        :visible.sync="changeCateDialogVisible"
        width="50%"
        center
        :show-close="false"
      >
        <el-form
          label-width="80px"
          ref="changeCateRef"
          :rules="changeCateRules"
          :model="cateForm"
        >
          <el-form-item label="ID">
            <el-input disabled v-model="cateForm.cat_pid"></el-input>
          </el-form-item>
          <el-form-item label="当前名称" prop="roleName">
            <el-input disabled v-model="cateForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="修改名称" prop="roleName">
            <el-input v-model="cateForm.change_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="resetForm('changeCateForm')">取 消</el-button>
          <el-button type="primary" @click="changCateFormCheckBtn">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 分页器 -->
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
        :page-sizes="[5, 10, 20]"
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
    return {
      queryInfo: {
        type: 3, // 查询参数
        pagenum: 1, // 当前页码
        pagesize: 5 // 每页显示条数
      },
      // 分页器需要的商品total
      total: 0,
      // 商品分类数据
      cateList: [],
      // 添加分类
      addCateList: [],
      cascaderSet: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover',
        checkStrictly: 'true'
      },
      // 用来记录添加分类的选项
      addCateValue: [],
      // 添加分类请求体
      cateForm: {
        cat_pid: 0,
        cat_name: '',
        cat_level: 0,
        change_name: ''
      },
      // 添加分类验证规则
      cateFormRules: {
        // 注意这里的名字要跟data里面的对应
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1-10个字符', trigger: 'blur' }
        ]
      },
      // 编辑分类验证规则
      changeCateRules: {
        // 注意这里的名字要跟data里面的对应
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度为3-10个字符', trigger: 'blur' }
        ]
      },
      // 添加分类对话框
      addCateDialogVisible: false,
      // 编辑分类对话框
      changeCateDialogVisible: false
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo
      })
      // 获取失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      // 获取成功
      this.cateList = res.data.result
      this.total = res.data.total
      console.log(this.cateList)
      //   console.log(res)
      // console.log(this.rolesList)
      //   this.total = this.rolesList.length
    },
    // 添加分类按钮
    async addCateBtn () {
      this.addCateDialogVisible = true
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      // 获取失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类列表失败')
      }
      // 获取成功
      this.addCateList = res.data
      //   console.log(this.addCateList)
      //   console.log(res)
      //   console.log(this.addCateList)
      //   this.total = this.rolesList.length
    },
    // 对话框用户重置按钮
    resetForm (formName) {
      if (formName === 'cateForm') {
        this.$refs.cateFormRef.resetFields()
        this.addCateDialogVisible = false
      }
      if (formName === 'changeCateForm') {
        this.$refs.changeCateRef.resetFields()
        this.changeCateDialogVisible = false
      }
    },
    // 添加分类确认按钮
    postCateForm () {
      this.$refs.cateFormRef.validate(async (bollean, object) => {
        if (
          bollean === true &&
          this.cateForm.cat_level !== undefined &&
          this.cateForm.cat_name !== undefined &&
          this.cateForm.cat_pid !== undefined
        ) {
          //   传参给服务器修改信息
          const { data: res } = await this.$http.post(
            'categories',
            this.cateForm
          )
          if (res.meta.status !== 201) {
            return this.$message.error('添加失败！')
          } else {
            // console.log(res)
            // 创建成功： 关闭对话框 弹窗 更新用户数据
            this.addCateDialogVisible = false
            this.$message.success('添加成功')
            this.getCateList()
          }
        } else {
          this.$message.error('请正确完成表格')
        }
      })
    },
    // 编辑按钮
    changeCateFormBtn (row) {
      // console.log(row)
      this.cateForm.change_name = ''
      this.cateForm.cat_pid = row.cat_id
      this.cateForm.cat_name = row.cat_name

      this.changeCateDialogVisible = true
    },
    // 编辑对话框确认按钮
    changCateFormCheckBtn () {
      // console.log(this.cateForm)
      this.$refs.changeCateRef.validate(async (bollean, object) => {
        if (this.cateForm.change_name === '') {
          this.$message.error('请正确完成表格')
        } else {
          //   传参给服务器修改信息
          const { data: res } = await this.$http.put(`categories/${this.cateForm.cat_pid}`, {
            cat_name: this.cateForm.change_name
          })
          if (res.meta.status !== 200) {
            return this.$message.error('修改失败！')
          } else {
            // console.log(res)
            // 创建成功： 关闭对话框 弹窗 更新用户数据
            this.changeCateDialogVisible = false
            this.$message.success('修改成功')
            this.getCateList()
          }
        }
      })
    },
    // 删除按钮
    deleteCateFormBtn (row) {
      // 记录角色ID和权限ID
      // console.log(row.id)
      // this.deleteTagDialogVisible = true
      this.$confirm('确定要删除该分类？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 请求删除权限
          // console.log('确认')
          // this.deleteTagDialogVisible = false
          // 传参给服务器删除用户
          const { data: res } = await this.$http.delete(
            `categories/${row.cat_id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          } else {
            console.log(res)
            // 创建成功： 关闭对话框 弹窗 更新用户数据
            this.$message.success('删除成功')
            this.getCateList()
            // 获取最新权限数据
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // 改变页码
    handleSizeChange (newSize) {
      // 改变每页显示数量
      // 重新发起数据请求 改变queryInfo拿数据

      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.queryInfo.pagenum = 1
      this.getCateList()
    },
    handleCurrentChange (newPage) {
      // 改变页码
      // 重新发起数据请求 改变queryInfo拿数据
      // console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    // 改变父类选项
    handleChange (value) {
      // addCateValue 就是 value
      //   console.log(value)
      if (value.length === 0) this.cateForm.cat_pid = 0
      else {
        this.cateForm.cat_pid = value[value.length - 1]
      }

      this.cateForm.cat_level = value.length
      console.log(this.cateForm)
    }
  }
}
</script>

<style lang="less" scoped>
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
.el-cascader {
  width: 100%;
}
</style>
