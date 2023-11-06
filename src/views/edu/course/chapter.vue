<template>
  <div class="app-container">
    <h2 style="text-align: center;">发布新课程</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息"/>
      <el-step title="创建课程大纲"/>
      <el-step title="最终发布"/>
    </el-steps>
    <el-button type="text" @click="openChapterDialog">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
        <li
            v-for="chapter in chapterVideoList"
            :key="chapter.id">
            <p>
                {{ chapter.title }}
                <span class="acts">
                    <el-button style="" type="text" @click="openVideo(chapter.id)">添加小节</el-button>
                    <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
                </span>
            </p>
            <!-- 视频 -->
            <ul class="chanpterList videoList">
                <li
                    v-for="video in chapter.children"
                    :key="video.id">
                    <p>{{ video.title }}
                        <span class="acts">
                            <el-button type="text">编辑</el-button>
                            <el-button type="text" @click="removeVideo(video.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
        </li>
    </ul>

    <el-form label-width="120px">
      <el-form-item>
        <el-button @click="previous">上一步</el-button>
        <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
      </el-form-item>
    </el-form>
    
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" title="添加课时">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title"/>
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="true">免费</el-radio>
            <el-radio :label="false">默认</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <!-- TODO -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import chapter from '@/api/edu/chapter'
import video from '@/api/edu/video'
export default {
    data() {
        return {
            saveBtnDisabled: false,
            chapterVideoList: [],
            courseId: '',
            dialogChapterFormVisible: false,
            chapter: {
              title: '', 
              sort: 0,
              courseId:''
            },
            dialogVideoFormVisible: false,
            saveVideoBtnDisabled: false,
            video: {// 课时对象
              title: '',
              sort: 0,
              free: 0,
              videoSourceId: ''
            }
        }
    },
    created() {
      if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        this.getChapterVideo()
      }
    },
    methods: {
        previous() {
            this.$router.push({path:'/course/info/'+this.courseId})
        },
        next() {
            this.$router.push({path:'/course/publish/'+this.courseId})
        },
        getChapterVideo() {
          chapter.getAllChapterVideo(this.courseId)
            .then(response => {
              this.chapterVideoList = response.data.allChapterVideo
            })
        },

        addChapter(){
          this.chapter.courseId = this.courseId
          chapter.addChapter(this.chapter)
            .then(response => {
              this.dialogChapterFormVisible = false
              this.$message({
              type: 'success',
              message: '添加章节成功'
              })  
              this.getChapterVideo()           
            })  
        },

        updateChapter() {
          chapter.updateChapter(this.chapter)
            .then(response => {
              this.dialogChapterFormVisible = false
              this.$message({
              type: 'success',
              message: '修改章节成功'
              })  
              this.getChapterVideo()           
            })            
        },
        saveOrUpdate() {
          if(!this.chapter.id)
          {
            this.addChapter()
          }else{
            this.updateChapter()
          }

        },

        openChapterDialog() {
          this.dialogChapterFormVisible=true
          this.chapter.title = ''
          this.chapter.sort = 0
        },

        openEditChapter(chapterId) {
          this.dialogChapterFormVisible = true
          chapter.getChapter(chapterId)
            .then(response => {
              this.chapter = response.data.chapter
            })
        },

        removeChapter(chapterId){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chapter.deleteChapter(chapterId)
                 .then(response => {
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    })
                    this.getChapterVideo()
                 })
        })          
        },

        //下面为对于小节的操作
        openVideo(chapterId){
          this.video.sort = 0
          this.video.title = ''
          this.free = 0
          this.dialogVideoFormVisible = true

          this.video.chapterId = chapterId
        },

        addVideo(){
          this.video.courseId = this.courseId
          video.addVideo(this.video)
            .then(response => {
              this.dialogVideoFormVisible = false
              this.$message({
              type: 'success',
              message: '添加小节成功'
              })  
              this.getChapterVideo()                 
            })
        },

        saveOrUpdateVideo(){
          this.addVideo()
        },

        removeVideo(videoId){
          this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          video.deleteVideo(videoId)
                 .then(response => {
                    this.$message({
                    type: 'success',
                    message: '删除成功!'
                    })
                    this.getChapterVideo()
                 })
        })           
        }
    }

}
</script>

