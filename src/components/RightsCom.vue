<template>
  <div class="RightsContainer">
    <div class="breadCrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 卡片 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <!--  -->
      <el-table :data="rightsList" style="width: 100%" stripe border>
        <el-table-column prop="id" label="ID" width="60"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">一级</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">二级</el-tag>
            <el-tag v-if="scope.row.level == 2" type="warning">三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    // 刚创建先获取权限列表
    this.getRightsList()
  },
  methods: {
    async getRightsList () {
      // 获取菜单数据
      const { data: res } = await this.$http.get('rights/list')
      // 获取失败
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      // 获取成功
      this.rightsList = res.data
      // console.log(this.rightsList)
    }
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb {
  margin-bottom: 12px;
}
.el-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table {
  margin-top: 12px;
}
.el-tag{
  user-select: none;
}
</style>
