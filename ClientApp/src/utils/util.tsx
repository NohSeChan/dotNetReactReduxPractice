
// str -> ascii
export const strToAscii = (str: any) => {
    var _ascii = [];
    for (let i: number = 0; i <= str.length - 1; i++) {
        _ascii.push(str.charCodeAt([i]));
    }
    return _ascii;
};

// ascii -> str
export const asciiToStr = (ascii: Array<any>) => {
    var str = "";
    for (var i = 0; i <= ascii.length - 1; i++) {
        str = str + String.fromCharCode(ascii[i]);
    }
    return str;
};


