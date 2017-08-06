function Dao(collectionType) {
    this.collectionType = collectionType;
}

Dao.prototype.getOne = function (id, callback) {
    this.collectionType.findById(id, callback);
}

Dao.prototype.getOneByUserName = function (userName, callback) {
    this.collectionType.findOne({ email: userName }, callback);
}

Dao.prototype.getAll = function (callback) {
    this.collectionType.find(callback);
}

Dao.prototype.save = function (obj, callback) {
    this.collectionType.save(callback);
}

module.exports = Dao;