export let numberToCommaNumber = (num : number | string) : string=>{
    return parseInt(num as any).toLocaleString("en-US");
}

export const DateToString = (date : Date)=>{
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year + "-" + month + "-" + day;
}