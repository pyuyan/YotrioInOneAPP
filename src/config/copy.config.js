module.exports = {
    copyEcharts: {
      src: ['./node_modules/echarts/dist/echarts.min.js'],
      dest: '{{WWW}}/build'
    },
    copyjQuery: {
      src: ['./bower_components/jQuery/dist/jquery.min.js'],
      dest: '{{WWW}}/build'
    },
    copyImageViewer: {
      src: ['./bower_components/ImageViewer/imageviewer.min.js'],
      dest: '{{WWW}}/build'
    },
    copyImgviewer: {
      src: ['./node_modules/ionic-img-viewer/dist/umd/ionic-img-viewer.js'],
      dest: '{{WWW}}/build'
    }
  }