<template>
  <div class="app-container">
    课程列表   
    <!--查询表单-->
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="courseQuery.name" placeholder="课程名称"/>
      </el-form-item>
      <el-form-item>
        <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
          <el-option :value="status1" label="已经发布"/>
          <el-option :value="status2" label="未发布"/>
        </el-select>
      </el-form-item>
      <el-form-item label="添加时间">
        <el-date-picker
          v-model="courseQuery.begin"
          type="datetime"
          placeholder="选择开始时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="courseQuery.end"
          type="datetime"
          placeholder="选择截止时间"
          value-format="yyyy-MM-dd HH:mm:ss"
          default-time="00:00:00"
        />
      </el-form-item>
      <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
      <el-button type="default" @click="resetData()">清空</el-button>
    </el-form>

    <el-table
      :data="list"
      element-loading-text="数据加载中"
      border
      fit
      highlight-current-row>
      <el-table-column
        label="序号"
        width="70"
        align="center">
        <template slot-scope="scope">
          {{ (page - 1) * limit + scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column prop="title" label="课程名称" />
      <el-table-column label="课程状态" width="80">
        <template slot-scope="scope">
          {{ scope.row.status=='Normal'?'已经发布':'未发布' }}
        </template>
      </el-table-column>
      <el-table-column prop="lessonNum" label="课时数" width="100" />
      <el-table-column prop="gmtCreate" label="添加时间" width="160"/>
      <el-table-column prop="viewCount" label="浏览数量" width="60" />
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <router-link :to="'/course/info/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程基本信息</el-button>
          </router-link>
          <router-link :to="'/course/chapter/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">编辑课程大纲</el-button>
          </router-link>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeDataById(scope.row.id)">删除课程信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      :current-page="page"
      :page-size="limit"
      :total="total"
      style="padding: 30px 0; text-align: center;"
      layout="total, prev, pager, next, jumper"
      @current-change="getList"
    />
  </div>
</template>

<script>
import course from '@/api/edu/course'
export default {
    // data:{

    // }
    data() {
        return {
            list: null,
            page: 1,
            limit: 4,
            total: 0,
            courseQuery: {},
            status1: 'Normal',
            status2: 'Draft'
        }
    },

    created() {
        this.getList()
    },

    methods: {
        getList(page =1) {
          this.page = page
          course.getListCourse(this.page,this.limit,this.courseQuery)
                  .then(respone =>{
                      this.list = respone.data.rows
                      this.total = respone.data.total
                  })
        },
        resetData() {
          this.courseQuery = {}
          this.getList()
        },
        // getList() {
        //   course.getListCourse()
        //           .then(respone =>{
        //               this.list = respone.data.list
        //           })
        // },        
        removeDataById(id) {
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          course.deleteCourseById(id)
                 .then(response => {
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    })
                    this.getList()
                 })
        })
        }       
    }
}
</script>