export const parseTime = (time) => {
    const source = parseInt(time);
    if (source) {
        let min = parseInt(source / 60);
        let sec = source % 60;
        if (min < 10) {
            min = "0" + min
        }
        if (sec < 10) {
            sec = "0" + sec
        }
        return min + ":" + sec;
    } else {
        return '00:00';
    }
};
export const parseDay=(time)=>{
	
	var thisdate=new Date(time);
	var year=thisdate.getFullYear();
	var month=thisdate.getMonth()+1;
	var day=thisdate.getDate();
	return year+'-'+(month<10?'0'+month:month)+'-'+(day<10?'0'+day:day);
}