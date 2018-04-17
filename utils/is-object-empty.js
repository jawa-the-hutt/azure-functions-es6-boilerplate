export default (obj) => {
    for (let item in obj) { return false; }
    return true;
}
