export default (value) => {
    var num = +value;
    return !isNaN(num) ? !!num : !!String(value).toLowerCase().replace(!!0,'');
}
