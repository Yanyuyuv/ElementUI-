<template>
  <div class="GoodsParamsContainer">
    <!-- 面包屑 -->
    <div class="breadCrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>商品管理</el-breadcrumb-item>
        <el-breadcrumb-item>分类参数</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <el-card class="box-card">
      <!-- 选择商品分类 -->
      <el-form label-width="80px" ref="cateFormRef">
        <el-form-item label="选择商品分类：" label-width="100">
          <el-cascader
            :options="cateList"
            :props="cascaderSet"
            v-model="chooseCateValue"
            clearable
            @change="handleChange"
            placeholder="请选择"
            :show-all-levels="false"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 动态参数 -->
        <el-tab-pane label="动态参数" name="many">
          <!-- 添加参数按钮 -->
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button type="primary" @click="addParamsBtn"
                >添加参数</el-button
              >
            </el-col>
          </el-row>

          <!-- 表格 -->
          <el-table :data="paramsList" style="width: 100%" stripe border>
            <!-- 下拉菜单 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- {{ scope.row }} -->
                <div
                  style="
                    width: 100%;
                    margin: 10px 0;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                  "
                >
                  <el-tag
                    v-for="(everyTags, index) in scope.row.attr_vals.split(',')"
                    :key="index"
                    closable
                    @close="tagClose(scope.row,index)"
                  >
                    {{ everyTags }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ New Tag</el-button
                  >
                </div>

                <!-- {{scope.row.attr_vals.split(',')}} -->
                <!-- <el-row
                  class="powerTagLeft"
                  v-for="power1 in scope.row"
                  :key="power1.attr_id"
                > -->
                <!-- ！！！注意 下面的用power1表示每一个一级权限 -->
                <!-- 一级权限 最左边 -->
                <!-- <el-col>
                                    v-for="everyTags in scope.row"

                  </el-col> -->
                <!-- </el-row> -->
              </template>
            </el-table-column>
            <el-table-column prop="attr_id" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
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
                    @click="changeFormBtn(scope.row)"
                    >修改</el-button
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
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 静态属性 -->
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加参数按钮 -->
          <el-row :gutter="20">
            <el-col :span="4">
              <el-button type="primary" @click="addParamsBtn"
                >添加属性</el-button
              >
            </el-col>
          </el-row>

          <!-- 表格 -->
          <el-table :data="paramsList" style="width: 100%" stripe border>
            <!-- 下拉菜单 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- {{ scope.row }} -->
                <div
                  style="
                    width: 100%;
                    margin: 10px 0;
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                  "
                >
                  <el-tag
                    style="
                      margin-left: 15px;
                      margin-top: 15px;
                      user-select: none;
                    "
                    v-for="(everyTags, index) in scope.row.attr_vals.split(',')"
                    :key="index"
                    closable
                    @close="tagClose(scope.row,index)"
                  >
                    {{ everyTags }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                    >+ New Tag</el-button
                  >
                </div>

                <!-- {{scope.row.attr_vals.split(',')}} -->
                <!-- <el-row
                  class="powerTagLeft"
                  v-for="power1 in scope.row"
                  :key="power1.attr_id"
                > -->
                <!-- ！！！注意 下面的用power1表示每一个一级权限 -->
                <!-- 一级权限 最左边 -->
                <!-- <el-col>
                                    v-for="everyTags in scope.row"

                  </el-col> -->
                <!-- </el-row> -->
              </template>
            </el-table-column>
            <el-table-column prop="attr_id" label="ID" width="60">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
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
                    @click="changeFormBtn(scope.row)"
                    >修改</el-button
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
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加参数对话框弹窗 -->
        <el-dialog
          :title="addParamsFormInfo.title"
          :visible.sync="addParamsDialogVisible"
          width="50%"
          center
          :show-close="false"
        >
          <el-form
            label-width="100px"
            ref="addParamsRef"
            :rules="addParamsRules"
            :model="addParams"
          >
            <el-form-item label="商品分类ID">
              <el-input disabled v-model="this.addParamsFormInfo.id"></el-input>
            </el-form-item>
            <el-form-item :label="this.addParamsFormInfo.name">
              <el-input v-model="addParams.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('addParams')">取 消</el-button>
            <el-button type="primary" @click="postParamsForm">确 定</el-button>
          </span>
        </el-dialog>

        <!-- 修改参数对话框 -->
        <el-dialog
          title="修改信息"
          :visible.sync="changeParamsDialogVisible"
          width="50%"
          center
          :show-close="false"
        >
          <el-form label-width="100px" :model="addParams" ref="changeParamsRef">
            <el-form-item label="参数ID">
              <el-input disabled v-model="this.addParamsFormInfo.id"></el-input>
            </el-form-item>
            <el-form-item label="当前参数名称">
              <el-input
                disabled
                v-model="this.addParamsFormInfo.name"
              ></el-input>
            </el-form-item>
            <el-form-item label="修改参数名称">
              <el-input v-model="addParams.attr_name"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="resetForm('changeParams')">取 消</el-button>
            <el-button type="primary" @click="postChangeParamsForm"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 选择商品分类
      cateList: [],
      chooseCateValue: [],
      cascaderSet: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        expandTrigger: 'hover'
      },
      // tabs标签页
      activeName: '',
      // new tag 输入！
      inputVisible: false,
      inputValue: '',
      // 添加参数弹窗
      addParamsDialogVisible: false,
      // 添加参数弹窗信息 用于区分添加属性还是参数
      addParamsFormInfo: {
        title: '',
        name: '',
        id: ''
      },
      // 添加参数弹窗表格确认信息
      addParams: {
        id: '', // 这个ID跟addParamsFormInfo的id一样
        attr_name: '',
        vals: ''
      },
      // 添加参数弹窗表格严重规则
      addParamsRules: {
        // 注意这里的名字要跟data里面的对应
        roleName: [
          { required: true, message: '请输入角色', trigger: 'blur' },
          { min: 1, max: 10, message: '长度为1-10个字符', trigger: 'blur' }
        ]
      },
      // 获取参数所需要的参数
      getParamsNeed: {
        id: '',
        sel: ''
      },
      // 获取的参数列表,
      paramsList: [],
      // 修改参数对话框
      changeParamsDialogVisible: false
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
      this.cateList = res.data
      // console.log(this.cateList)
      //   this.total = res.data.total
      // console.log(this.cateList)
      //   console.log(res)
      // console.log(this.rolesList)
      //   this.total = this.rolesList.length
    },
    // 获取参数列表
    async getParamsList () {
      const { data: res } = await this.$http.get(
        `categories/${this.getParamsNeed.id}/attributes`,
        {
          params: { sel: this.getParamsNeed.sel }
        }
      )
      // 获取失败
      if (res.meta.status !== 200) {
        return this.$message.error('获取参数失败')
      }
      this.paramsList = res.data
      console.log(this.paramsList)
      // const tagsList = this.paramsList[0].attr_vals.split(',')
      // console.log(tagsList)
    },
    addParamsBtn () {
      this.addParams.attr_name = ''
      if (this.activeName === 'only') {
        this.addParamsFormInfo.title = '添加属性'
        this.addParamsFormInfo.name = '添加属性名称'
      }
      if (this.activeName === 'many') {
        this.addParamsFormInfo.title = '添加参数'
        this.addParamsFormInfo.name = '添加参数名称'
      }
      this.addParamsFormInfo.id = this.getParamsNeed.id
      this.addParams.id = this.getParamsNeed.id
      this.addParamsDialogVisible = true
    },
    // 添加分类对话框的确认按钮
    async postParamsForm () {
      // console.log(this.addParams.id)
      // console.log(this.addParams.attr_name)
      // console.log(this.activeName)
      const { data: res } = await this.$http.post(
        `categories/${this.addParams.id}/attributes`,
        {
          attr_name: this.addParams.attr_name,
          attr_sel: this.activeName
        }
      )
      // console.log(res)
      // 获取失败
      if (res.meta.status !== 201) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('添加成功')
      this.getParamsList()
      this.addParamsDialogVisible = false
      // this.paramsList = res.data
      // const tagsList = this.paramsList[0].attr_vals.split(',')
      // console.log(tagsList)
    },
    // 修改分类信息提交
    async postChangeParamsForm () {
      // console.log(this.addParams.id)// 分类ID
      // console.log(this.addParamsFormInfo.id)// 参数ID
      // console.log(this.addParams.attr_name)// 修改名字
      // console.log(this.activeName)// 静态还是动态
      // console.log(this.addParams.vals)// vals
      const { data: res } = await this.$http.put(
        `categories/${this.addParams.id}/attributes/${this.addParamsFormInfo.id}`,
        {
          attr_name: this.addParams.attr_name,
          attr_sel: this.activeName,
          attr_vals: this.addParams.vals
        }
      )
      // console.log(res)
      // 获取失败
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success('修改成功')
      this.getParamsList()
      this.changeParamsDialogVisible = false
      // this.paramsList = res.data
      // const tagsList = this.paramsList[0].attr_vals.split(',')
      // console.log(tagsList)
    },
    // 添加用户重置
    resetForm (formName) {
      if (formName === 'addParams') {
        this.$refs.addParamsRef.resetFields()
        this.addParamsDialogVisible = false
      }
      if (formName === 'changeParams') {
        this.$refs.changeParamsRef.resetFields()
        this.changeParamsDialogVisible = false
      }
    },
    // 选择分类的change事件
    handleChange (value) {
      this.getParamsNeed.id = value[value.length - 1]
      // 选择一个分类之后
      // 1. 重置tag
      this.activeName = ''
    },
    // tabs标签页的change事件
    handleClick (tab, event) {
      this.getParamsNeed.sel = this.activeName
      //   console.log(this.getParamsNeed)
      // 点击tab标签后发起请求获取参数数据
      this.getParamsList()
    },
    // 删除参数按钮
    deleteFormBtn (row) {
      console.log(row)
      // console.log(this.addParams.id) // 商品分类ID
      // console.log(this.addParams.attr_name)
      // console.log(this.activeName)
      this.$confirm('确定要删除吗？', '提示', {
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
            `categories/${row.cat_id}/attributes/${row.attr_id}`
          )
          if (res.meta.status !== 200) {
            return this.$message.error('删除失败！')
          } else {
            console.log(res)
            // 创建成功： 关闭对话框 弹窗 更新用户数据
            this.$message.success('删除成功')
            this.getParamsList()
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
    // 修改参数按钮
    changeFormBtn (row) {
      // console.log(row)
      this.addParams.attr_name = ''
      this.addParamsFormInfo.name = row.attr_name // 当前参数名称
      this.addParamsFormInfo.id = row.attr_id // 参数ID
      this.addParams.id = row.cat_id // 分类ID
      this.addParams.vals = row.attr_vals // vals
      this.changeParamsDialogVisible = true
    },
    // tag关闭按钮
    tagClose (row, index) {
      const arr = row.attr_vals.split(',')
      // 删除都是tag那一项
      arr.splice(index, 1)
      // 生成新字符串
      this.$confirm('确定要删除吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 请求删除权限
          console.log(row)
          const { data: res } = await this.$http.put(
            `categories/${row.cat_id}/attributes/${row.attr_id}`,
            {
              attr_name: row.attr_name,
              attr_sel: this.activeName,
              attr_vals: arr.join(',')
            }
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          this.$message.success('删除成功')
          this.getParamsList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    handleClose (tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1)
    },

    showInput () {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    async handleInputConfirm (row) {
      const inputValue = this.inputValue
      let newVals = row.attr_vals // vals
      if (inputValue) {
        // 记录输入tag内容
        if (newVals) newVals = newVals + ',' + inputValue
        else newVals = newVals + inputValue

        // 发送编辑请求
        const { data: res } = await this.$http.put(
          `categories/${row.cat_id}/attributes/${row.attr_id}`,
          {
            attr_name: row.attr_name,
            attr_sel: this.activeName,
            attr_vals: newVals
          }
        )
        // console.log(res)
        // 获取失败
        if (res.meta.status !== 200) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('修改成功')
        this.getParamsList()
        // this.paramsList = res.data
        // const tagsList = this.paramsList[0].attr_vals.split(',')
        // console.log(tagsList)
      }
      // console.log(row.attr_id)
      // console.log(row.cat_id)
      // console.log(row.attr_name)
      // console.log(this.activeName)
      // console.log(newVals)
      this.inputVisible = false
      this.inputValue = ''
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag,
.button-new-tag {
  margin-left: 15px;
  margin-top: 15px;
  user-select: none;
}
.input-new-tag {
  margin: 15px 15px;
}
</style>
