function Dao(collectionType) {
    this.collectionType = collectionType;
}

Dao.prototype.getOne = function (id, callback) {
    this.collectionType.findById(id, callback);
}

Dao.prototype.get = function (id, callback,filter) {
    this.collectionType.findOne(filter).exec(callback);
}

Dao.prototype.getMany = function (callback) {
    this.collectionType.find(callback);
}

Dao.prototype.getManyFilter = function (callback,filter) {
    this.collectionType.find(filter,callback);
}

Dao.prototype.save = function (obj, callback) {
    this.collectionType.save(obj,callback);
}

Dao.prototype.findByIdAndUpdate = function (id, obj, callback) {
    this.collectionType.findByIdAndUpdate(id,obj,{new:true},callback);
}

Dao.prototype.login = function (id, callback,filter) {
    this.collectionType.findOne(filter,'+password').exec(callback);
}

module.exports = Dao;