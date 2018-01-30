class Dao {
    constructor(collectionType) {
        this.collectionType = collectionType;
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-find
     * @param {* filter   = query based on the mongo search filter applies} filter
     * @param {* populate = if it is not null, alogn with found document, populated document also returns} populateQuery
     * @param {* callback = callback function whch executes  (error, documents)} callback ,
     */
    find(filter, populateQuery,projectionQuery,sortOptions, callback) {
        var sortOption = {
            _id: '-1'
        };
        if (sortOptions != null) {
            sortOption = sortOptions;
        }
        if (populateQuery != null) {
            this.collectionType.find(filter,projectionQuery)
                .populate(populateQuery)
                .sort(sortOption)
                .exec(callback);
        } else {
            this.collectionType.find(filter,projectionQuery)
            .sort(sortOption)
            .exec(callback);
        }
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-findOne
     * @param {* filter   = query based on the mongo search filter applies} filter
     * @param {* populate = if it is not null, alogn with found document, populated document also returns} populateQuery
     * @param {* callback = callback function whch executes  (error, document)} callback ,
     * @param {* projectionQuery = Select only reuired fileds}
     */
    findOne(filter, populateQuery, projectionQuery, callback) {
        if (populateQuery != null) {
            this.collectionType.findOne(filter, projectionQuery)
                .populate(populateQuery)
                .exec(callback);
        } else {
            this.collectionType.findOne(filter,projectionQuery).exec(callback);
        }
    }
    /**
     *
     * @param {*} id
     * @param {*} populateQuery
     * @param {*} projectionQuery
     * @param {*} callback
     */
    findById(id, populateQuery, projectionQuery, callback) {
        if (populateQuery != null) {
            this.collectionType.findById(id, projectionQuery)
                .populate(populateQuery)
                .exec(callback);
        } else {
            this.collectionType.findById(id).exec(callback);
        }
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-findOneAndRemove
     * @param {*} filter
     * @param {*} options
     * @param {*} callback
     */
    findOneAndRemove(filter, options, callback) {
        this.collectionType.findOneAndRemove(filter, options).exec(callback);
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-findOneAndUpdate
     * @param {*} filter
     * @param {*} options
     * @param {*} callback
     */
    findOneAndUpdate(filter,updateObj, options, callback) {
        this.collectionType.findOneAndUpdate(filter,updateObj, options).exec(callback);
    }
    /**
     *
     * @param {*} id
     * @param {*} obj
     * @param {*} callback
     */
    findByIdAndUpdate(id, obj,options, callback) {
        this.collectionType.findByIdAndUpdate(id, obj, options, callback);
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-remove
     * @param {*} filter
     * @param {*} callback
     */
    remove(filter, callback) {
        this.collectionType.remove(filter).exec(callback);
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-select
     * @param {*} filter
     * @param {*} callback
     */
    select(filter, callback) {
        this.collectionType.select(filter).exec(callback);
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-update
     * @param {*} filter
     * @param {*} updateObj
     * @param {*} options
     * @param {*} callback
     */
    update(filter, updateObj, options, callback) {
        this.collectionType.update(filter,updateObj, options).exec(callback);
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-updateMany
     * @param {*} filter
     * @param {*} updateObj
     * @param {*} options
     * @param {*} callback
     */
    updateMany(filter, updateObj, options, callback) {
        this.collectionType.where(filter).updateMany(updateObj, options).exec(callback);
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-updateOne
     * @param {*} filter
     * @param {*} updateObj
     * @param {*} options
     * @param {*} callback
     */
    updateOne(filter, updateObj, options, callback) {
        this.collectionType.where(filter).updateOne(updateObj, options).exec(callback);
    }
    /**
     * http://mongoosejs.com/docs/api.html#query_Query-deleteMany
     * @param {*} filter
     * @param {*} callback
     */
    deleteMany(filter, callback) {
        this.collectionType.deleteMany(filter).exec(callback);
    }
    /**
     *
     * @param {*} filter
     * @param {*} callback
     */
    deleteOne(filter, callback) {
        this.collectionType.deleteOne(filter).exec(callback);
    }
    /**
     * Saves new record to database
     * @param {*} newObj
     * @param {*} callback
     */
    save(newObj, callback) {
        newObj.save(callback);
    }
    /**
     *
     * @param {*} id
     * @param {*} callback
     * @param {*} filter
     */
    login(id, callback, filter) {
        this.collectionType.findOne(filter, '+password')
            .populate([{
                path: 'profileImages',
                match: {
                    IsActive: true
                }
            }]).exec(callback);
    }

    aggregate(findQuery,callback){
      this.collectionType.aggregate(findQuery)
      .exec(callback);
    }

    // getOne(id, callback) {
    //     this.collectionType.findById(id, callback);
    // }
    // get(id, callback, filter) {
    //     this.collectionType.findOne(filter).exec(callback);
    // }
    // getMany(callback) {
    //     this.collectionType.find(callback);
    // }
    // getManyFilter(filter, callback) {
    //     this.collectionType.find(filter, callback);
    // }
    // save(obj, callback) {
    //     this.collectionType.save(obj, callback);
    // }
    // findByIdAndUpdate(id, obj, callback) {
    //     this.collectionType.findByIdAndUpdate(id, obj, {
    //         new: true
    //     }, callback);
    // }
    // login(id, callback, filter) {
    //     this.collectionType.findOne(filter, '+password')
    //         .populate([{
    //             path: 'profileImages',
    //             match: {
    //                 IsActive: true
    //             }
    //         }]).exec(callback);
    // }
    // getFilter(filter, populateQuery, callback) {
    //     if (populateQuery != null) {
    //         this.collectionType.find(filter)
    //             .populate(populateQuery)
    //             .exec(callback);
    //     } else {
    //         this.collectionType.find(filter)
    //             .exec(callback);
    //     }
    // }
}
module.exports = Dao;
