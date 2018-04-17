export default (value) => {
    let guidRegExp = new RegExp('^([0-9a-fA-F]){8}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){4}-([0-9a-fA-F]){12}$');
    return guidRegExp.test(value);
}
