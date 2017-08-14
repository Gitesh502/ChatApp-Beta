module.exports.Unique = function (reqarray) {
    return reqarray.filter(function (elem, pos) {
        return reqarray.indexOf(elem) == pos;
    });
}