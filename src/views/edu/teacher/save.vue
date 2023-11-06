<template>
  <div class="app-container">
    <div>{{theTarget}}</div>
    <!-- <el-input v-model="theMessage"/> -->
    <el-form label-width="120px">
      <el-form-item label="讲师名称">
        <el-input v-model="teacher.name"/>
      </el-form-item>
      <el-form-item label="讲师排序">
        <el-input-number v-model="teacher.sort" controls-position="right" min="0"/>
      </el-form-item>
      <el-form-item label="讲师头衔">
        <el-select v-model="teacher.level" clearable placeholder="请选择">
          <el-option :value="1" label="高级讲师"/>
          <el-option :value="2" label="首席讲师"/>
        </el-select>
      </el-form-item>
      <el-form-item label="讲师资历">
        <el-input v-model="teacher.career"/>
      </el-form-item>
      <el-form-item label="讲师简介">
        <el-input v-model="teacher.intro" :rows="10" type="textarea"/>
      </el-form-item>
      <!-- 讲师头像 -->
      <el-form-item label="讲师头像">
      <!-- 头衔缩略图 -->
        <pan-thumb :image="teacher.avatar"/>
        <!-- 文件上传按钮 -->
        <el-button type="primary" icon="el-icon-upload" @click="imagecropperShow=true">更换头像
        </el-button>
        <!--
        v-show：是否显示上传组件
        :key：类似于id，如果一个页面多个图片上传控件，可以做区分
        :url：后台上传的url地址
        @close：关闭上传组件
        @crop-upload-success：上传成功后的回调 -->
        <image-cropper
                   v-show="imagecropperShow"
                   :width="300"
                   :height="300"
                   :key="imagecropperKey"
                   :url="BASE_API+'/eduoss/fileoss'"
                   field="file"
                   @close="close"
                   @crop-upload-success="cropSuccess"/>
      </el-form-item>
      <el-form-item>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import teacherApi from '@/api/edu/teacher'
import ImageCropper from '@/components/ImageCropper'
import PanThumb from '@/components/PanThumb'

export default {
  components: { ImageCropper, PanThumb },
  data() {
    return {
      theTarget: '添加讲师',
      teacher: {
        name: '',
        sort: 0,
        level: 1,
        career: '',
        intro: '',
        avatar: 'https://guliedu-2002.oss-ap-northeast-1.aliyuncs.com/2023/10/18/0468fbc50b85436a9a605c2dd69be221file.png'
      },
      saveBtnDisabled: false,
      imagecropperShow: false,
      imagecropperKey: 0,
      BASE_API: process.env.VUE_APP_BASE_API
    }
  },
  created() {
    this.init()
  },
  watch: {
    $route(to, from) {
      this.init()
    }
  },
  methods: {
    init() {
      if (this.$route.params && this.$route.params.id) {
        const id = this.$route.params.id
        this.theTarget = '修改讲师'
        this.getInfo(id)
      } else {
        this.theTarget = '添加讲师'
        this.teacher = {}
      }      
    },
    close() {
      this.imagecropperShow = false
      this.imagecropperKey = this.imagecropperKey+1
    },
    // 头像上传
    cropSuccess(data) {
      this.imagecropperShow = false
      this.teacher.avatar = data.url
      this.imagecropperKey = this.imagecropperKey+1
    },
    getInfo(id) {
      teacherApi.getTeacherInfo(id)
        .then(respone => {
          this.teacher = respone.data.teacher
        })
    },
    saveOrUpdate() {
      if(!this.teacher.id) {
        this.saveTeacher()
      } else {
        this.updateTeacher()
      }
    },

    saveTeacher() {
      this.$confirm('此操作将添加讲师, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          teacherApi.addTeacher(this.teacher)
          .then(respone =>{
            this.$message({
            type: 'success',
            message: '添加成功!'
            })
            this.$router.push({path:'/teacher/table'})
          })
        })
    },
    updateTeacher() {
      this.$confirm('此操作将修改讲师, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          teacherApi.updateTeacherInfo(this.teacher)
          .then(respone =>{
            this.$message({
            type: 'success',
            message: '修改成功!'
            })
            this.$router.push({path:'/teacher/table'})
          })
        })
    }
  }
}
</script>