function numberToFormattedString(number) {

    var string;

    if(number >= 1000000000) {
        string = (number / 1000000000).toFixed(1) + "B";
    }
    else if(number >= 1000000) {
        string = (number / 1000000).toFixed(1) + "M";
    }
    else if(number >= 1000) {
        string = (number / 1000).toFixed(1) + "K";
    }
    else {
        return "" + number;
    }

    if(string.slice(-2,-1) == 0) {
        return string.slice(0, -3) + string.slice(-1);
    }
    else {
        return string;
    }
}
