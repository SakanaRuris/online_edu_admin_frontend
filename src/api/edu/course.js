import request from '@/utils/request'

export default {
    addCourseInfo(courseInfo){
        return request({
            url: `/eduservice/course/addCourseInfo`,
            method: 'post',
            data: courseInfo
          })
    },
    getListTeacher() {
        return request({
            url: `/eduservice/teacher/findAll`,
            method: 'get'
          })
    },
    getCourseInfoById(id) {
        return request({
            url: `/eduservice/course/getCourseInfo/${id}`,
            method: 'get'
          })
    },
    updateCourseInfo(courseInfo) {
        return request({
            url: `/eduservice/course/updateCourseInfo`,
            method: 'post',
            data: courseInfo
          })
    },

    getPublishCourseInfo(courseId){
        return request({
            url: `/eduservice/course/getPublishCourseInfo/${courseId}`,
            method: 'get'
          })
    },

    publishCourse(courseId){
        return request({
            url: `/eduservice/course/publishCourse/${courseId}`,
            method: 'post'
          })
    },

    getListCourse(current, limit, courseQuery){
        return request({
            url: `/eduservice/course/pageCourseCondition/${current}/${limit}`,
            method: 'post',
            data: courseQuery
          })
    },

    deleteCourseById(courseId) {
        return request({
            url: `/eduservice/course/${courseId}`,
            method: 'delete'
          })
    },
}
