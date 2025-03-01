// 歌词数据格式：[时间(秒), 歌词文本]
const lyrics = [
    [0, "birds of a feather - Billie Eilish"],
    [2, "《birds of a feather》"],
    [4, ""],
    [6, "Can't take it back, once it's been set in motion"],
    [12, "You were speaking my language, a different kind of communication"],
    [20, "And my friends all say they're worried 'bout me"],
    [25, "But I know all these things that you would never tell nobody"],
    [32, "Birds of a feather fly together"],
    [36, "Stickin' around this time, hope you're down for the weather"],
    [43, "Don't know if I'll get over you otherwise"],
    [48, "Face to remember, it didn't take me very long to find"],
    [54, "I can't remember half of what I said last week"],
    [60, "But I know exactly what you did, in my dreams last night, you said"],
    [65, "Somethin' so sweet I couldn't, shake it when I woke up"],
    [71, "Now you're stuck in my head, I hope you can't get me out of yours"],
    [77, "Birds of a feather fly together"],
    [82, "Stickin' around this time, hope you're down for the weather"],
    [89, "Don't know if I'll get over you otherwise"],
    [94, "Face to remember, it didn't take me very long to find"],
    [100, "Either way, I'm fine"],
    [102, "Either way, I'll mind my business if you mind yours"],
    [107, "Either way, I'm fine"],
    [109, "Either way, I'll mind my business if you mind yours"],
    [115, "Either way, I'm fine"],
    [117, "Either way, I'll mind my business if you mind yours"],
    [123, "Either way, I'm fine"],
    [126, "Birds of a feather fly together"],
    [132, "Stickin' around this time, hope you're down for the weather"],
    [138, "Don't know if I'll get over you otherwise"],
    [143, "Face to remember, it didn't take me very long"],
    [149, "Birds of a feather fly together"],
    [154, "Stickin' around this time, hope you're down for the weather"],
    [160, "Don't know if I'll get over you otherwise"],
    [165, "Face to remember, it didn't take me very long to find"],
    [172, ""],
];

// 导出歌词数据以便在其他文件中使用
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { lyrics };
} else {
    // 浏览器环境下，将歌词数据挂载到window对象
    window.lyricsData = { lyrics };
} 