// 歌词数据格式：[时间(秒), 歌词文本]
const lyrics = [
    [0, "('Til I'm in the grave)"],
    [3, "I want you to stay"],
    [8, "'Til I'm in the grave"],
    [13, "'Til I rot away, dead and buried"],
    [17, "'Til I'm in the casket you carry"],
    [21, "If you go, I'm going too, uh"],
    [26, "'Cause it was always you, alright"],
    [31, "And if I'm turnin' blue, please don't save me"],
    [35, "Nothing left to lose without my baby"],
    [41, "Birds of a feather, we should stick together, I know"],
    [46, "I said I'd never think I wasn't better alone"],
    // 继续为其他行添加适当的时间点
];                                          

// 导出歌词数据以便在其他文件中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lyrics };
} else {
    // 浏览器环境下，将歌词数据挂载到window对象
    window.lyricsData = { lyrics };
} 