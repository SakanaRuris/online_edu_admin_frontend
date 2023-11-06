import request from '@/utils/request'

export default {
    addVideo(video){
        return request({
            url: `/eduservice/video/addVideo`,
            method: 'post',
            data: video
          })
    },

    deleteVideo(videoId){
        return request({
            url: `eduservice/video/deleteVideo/${videoId}`,
            method: 'delete',
          })
    }
}
