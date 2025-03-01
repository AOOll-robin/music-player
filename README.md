# 简易音乐播放器

这是一个使用HTML、CSS和JavaScript构建的简单音乐播放器网页。仅用于个人学习。

## 功能

- 播放/暂停音乐
- 进度条控制
- 音量调节
- 显示歌曲信息和专辑封面

## 使用方法

1. 将您的音乐文件（MP3格式）放入`assets`文件夹中，并命名为`sample.mp3`
2. 在浏览器中打开`index.html`文件

## 自定义

您可以在`script.js`文件中修改`songInfo`对象来更改歌曲信息：

```javascript
const songInfo = {
    title: '您的歌曲名称',
    artist: '您的歌手名称',
    coverUrl: '您的封面图片URL',
    audioUrl: 'assets/您的音乐文件.mp3'
};
```


## 技术栈

- HTML5
- CSS3
- JavaScript (ES6+) 
