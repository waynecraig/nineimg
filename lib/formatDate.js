/**
 * 让日期和时间按照指定的格式显示的方法
 * @method date
 * @memberOf format
 * @param {String} format 格式字符串
 * @return {String} 返回生成的日期时间字符串
 *
 * @example
 * Jx().$package(function(J){
 *     var d = new Date();
 *     // 以 YYYY-MM-dd hh:mm:ss 格式输出 d 的时间字符串
 *     J.format.date(d, "YYYY-MM-DD hh:mm:ss");
 * };
 *
 */

const dayMap = ['日', '一', '二', '三', '四', '五', '六']

module.exports = (date, formatString) => {
    /*
     * eg:formatString="YYYY-MM-DD hh:mm:ss";
     */
    var o = {
        "M+" : date.getMonth()+1,    //month
        "D+" : date.getDate(),    //day
        "h+" : date.getHours(),    //hour
        "m+" : date.getMinutes(),    //minute
        "s+" : date.getSeconds(),    //second
        "q+" : Math.floor((date.getMonth()+3)/3),    //quarter
        "S+" : date.getMilliseconds(),    //millisecond
        "d+" : dayMap[date.getDay()],    //day in week
    }

    if(/(Y+)/.test(formatString)){
        formatString = formatString.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    }

    for(var k in o){
        if(new RegExp("("+ k +")").test(formatString)){
            formatString = formatString.replace(RegExp.$1, RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
        }
    }
    return formatString;
}

