import request from '@/utils/request'

export default {
    getSubjectList(){
        return request({
            // url: '/vue-admin-template/table/list/'+current+"/"+limit,
            url: `/eduservice/subject/getAllSubject`,
            method: 'get'
            // params
          })
    }
}
