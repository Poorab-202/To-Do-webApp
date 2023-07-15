module.exports.getDate=getDate;
function getDate() {
    let date = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    let day = date.toLocaleDateString("en-US", options);
    return(day);
}
module.exports.getDay=getDay;
function getDay() {
    let date = new Date();
    var options = {
        weekday: "long",  
    }
    let day = date.toLocaleDateString("en-US", options);
    return(day);
}