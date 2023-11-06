<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-form label-width="120px">
        <el-form-item label="课程标题">
            <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>
        <!-- 所属分类 -->
        <el-form-item label="课程分类">
        <el-select
            v-model="courseInfo.subjectParentId"
            placeholder="一级分类" @change="subjectOneChanged">
            <el-option
                v-for="subject in subjectOneList"
                :key="subject.id"
                :label="subject.title"
                :value="subject.id"/>
        </el-select>
        <!-- 二级分类 -->
        <el-select v-model="courseInfo.subjectId" placeholder="二级分类">
        <el-option
            v-for="subject in subjectTwoList"
            :key="subject.id"
            :label="subject.title"
            :value="subject.id"/>
        </el-select>
        </el-form-item>        
        <!-- 课程讲师 -->
        <el-form-item label="课程讲师">
        <el-select
            v-model="courseInfo.teacherId"
            placeholder="请选择">
            <el-option
                v-for="teacher in teacherList"
                :key="teacher.id"
                :label="teacher.name"
                :value="teacher.id"/>
        </el-select>
        <!-- 课程课时 -->
        </el-form-item>
        <el-form-item label="总课时">
            <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>
        <!-- 课程简介 TODO -->
        <el-form-item label="课程简介">
            <el-input v-model="courseInfo.description" placeholder=" "/>
        </el-form-item>
        <!-- 课程封面-->
        <el-form-item label="课程封面">
        <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduoss/fileoss'"
            class="avatar-uploader">
            <img :src="courseInfo.cover">
        </el-upload>
        </el-form-item>
        <!-- 课程价格-->
        <el-form-item label="课程价格">
            <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>
        <el-form-item>
            <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
        </el-form-item>
    </el-form>
  </div>
</template>

<script>
import course from '@/api/edu/course'
import subject from '@/api/edu/subject'
export default {
    data() {
        return {
            saveBtnDisabled: false,
            courseInfo: {
                title: '',
                subjectParentId: '',
                subjectId: '',
                teacherId: '',
                lessonNum: 0,
                description: '',
                cover: '/static/favicon.jpg',
                price: 0
            },
            teacherList: [],
            subjectOneList: [],
            subjectTwoList: [],
            BASE_API: process.env.VUE_APP_BASE_API,
            courseId: ''
        }
    },
    created() {
        if(this.$route.params && this.$route.params.id){
            this.courseId = this.$route.params.id
            this.getInfoById()
        } else {
            this.getOneSubject()
        }
        this.getListTeacher()    
    },
    methods: {
        getOneSubject(){
            subject.getSubjectList()
              .then(response => {
                this.subjectOneList = response.data.list
              })            
        },
        subjectOneChanged(value) {
            // alert(value)
            for(var i=0; i<this.subjectOneList.length; i++) {
                var oneSubject = this.subjectOneList[i]
                if(value === oneSubject.id) {
                    this.subjectTwoList = oneSubject.children
                    this.courseInfo.subjectId = ''
                    break
                }
            }
        },
        getListTeacher() {
            course.getListTeacher()
              .then(response => {
                this.teacherList = response.data.items
              })
        },
        addCourse(){
            course.addCourseInfo(this.courseInfo)
              .then(response => {
                    this.$message({
                    type: 'success',
                    message: '添加课程信息成功'
                    })
                    this.$router.push({path:'/course/chapter/'+response.data.courseId})
              })
        },
        updateCourse(){
            course.updateCourseInfo(this.courseInfo)
              .then(response => {
                    this.$message({
                    type: 'success',
                    message: '修改课程信息成功'
                    })
                    this.$router.push({path:'/course/chapter/'+this.courseId})
              })
        },
        saveOrUpdate() {
            if(!this.courseInfo.id){
                this.addCourse()
            }else {
                this.updateCourse()
            }
        },
        //上传封面成功
        handleAvatarSuccess(res, file) {
            this.courseInfo.cover = res.data.url
        },
        //上传封面之前
        beforeAvatarUpload(file) {
            const isJPG = file.type === 'image/jpeg'
            const isLt2M = file.size / 1024 / 1024 < 2
            if (!isJPG) {
                this.$message.error('上传头像图片只能是 JPG 格式!')
            }
            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!')
            }
            return isJPG && isLt2M
        },
        getInfoById(){
            course.getCourseInfoById(this.courseId)
              .then(response => {
                this.courseInfo = response.data.courseInfoVo
                subject.getSubjectList()
                  .then(response => {
                    this.subjectOneList = response.data.list
                    for(var i = 0;i<this.subjectOneList.length;i++){
                        var oneSubject = this.subjectOneList[i];
                        if(this.courseInfo.subjectParentId == oneSubject.id){
                            this.subjectTwoList = oneSubject.children
                        }
                    }
                  })
              })
        }
    }

}
</script>