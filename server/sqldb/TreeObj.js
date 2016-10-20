'use strict';

var _ = require('lodash');
var Promise = require('bluebird');
//import * as db from './index';
var Model;

function TreeObj(Model) {
    Model = Model;

    this.find = function (data) {
        if (Model && !isNaN(data) && data > 0) {
            return Model.findById(data);
        }
        else if (typeof data === 'object' && !Array.isArray(data)) {
            if (data.Model) {
                return Promise.resolve(data);
            }
            else if (data.name && data.spaceId) {
                if (Model) {
                    if (data.parentId && data.parentId > 0) {
                        return Model.findById(data.parentId).then(function (parent) {
                            return Model.find({
                                fullname: parent.fullname + '.' + data.name,
                                spaceId: spaceId
                            })
                        })
                    }
                    else if (data.parent && typeof data.parent === 'object') {
                        var parentName = data.parent.fullname || data.parent.name;
                        var fullname = parentName ? parentName + '.' + data.name : data.name;
                        return Model.find({
                            fullname: fullname,
                            spaceId: spaceId
                        })
                    }
                    else if (data.parent && typeof data.parent === 'string') {
                        return Model.find({
                            fullname: parent + '.' + data.name,
                            spaceId: spaceId
                        })
                    }
                    else {
                        return Model.find({
                            where: {
                                name: data.name,
                                spaceId: data.spaceId
                            }
                        })
                    }
                } else {
                    return Promise.reject('no Model find!');
                }
            }
            else {
                return Promise.reject('must provide name and spaceId');
            }
        }
        else {
            return Promise.resolve(null);
        }
    }

    this.create = function (data) {
        if (typeof data !== 'object' || Array.isArray(data)) {
            return Promise.reject('please provide object data!');
        } else {
            if (!data.spaceId) {
                return Promise.reject('please provide spaceId in data');
            }
            else if (!data.name) {
                return Promise.reject('please provide name in data!');
            }
            else {
                if (data.parentId && data.parentId > 0) {
                    return Model.findById(data.parentId).then(function (parent) {
                        if (parent) {
                            data.fullname = parent.fullname + '.' + data.name;
                        }
                        return Model.findOrCreate({
                            where: {
                                name: data.name,
                                spaceId: data.spaceId
                            },
                            default: data
                        }).spread(function (entity, created) {
                            return Promise.resolve(entity);
                        })
                    })
                }
                else {
                    return Model.findOrCreate({
                        where: {
                            name: data.name,
                            spaceId: data.spaceId
                        },
                        default: data
                    }).spread(function (entity, created) {
                        return Promise.resolve(entity);
                    })
                }
            }
        }
    }

    this.update = function (data, model) {
        if (typeof data !== 'object' || Array.isArray(data)) {
            return Promise.reject('please provide object data!');
        } else {
            var modelId = data.id || data._id || null;
            if (modelId && modelId > 0) {
                return Model.findById(modelId).then(function (oModel) {
                    model = oModel;
                    if (data.name) {
                        data.fullname = model.fullname.substring(0, type.fullname.lastIndexOf('.')) + data.name;
                    }
                    return model.update(data);
                })
            } else {
                if (model) {
                    if (data.name) {
                        data.fullname = model.fullname + "." + data.name;
                    }
                    return model.update(data);
                } else {
                    return Promise.reject('fail to update');
                }
            }
        }
    }

    this.addChild = function (childData, parent) {

        var data = childData;

        if (typeof data !== 'object' || Array.isArray(data)) {
            return Promise.reject('please provide object childData!');
        } else {
            if (!data.name) {
                return Promise.reject('please provide name in childData!');
            }
            else {
                var Model = parent.model();
                data.fullname = parent.fullname + '.' + data.name;
                return Model.findOrCreate({
                    where: {
                        fullname: data.fullname,
                        spaceId: data.spaceId
                    },
                    default: data
                }).spread(function (entity, created) {
                    return Promise.resolve(entity);
                })
            }
        }
    }

    this.updateChild = function (childData, parent) {

        var data = childData;

        if (typeof data !== 'object' || Array.isArray(data)) {
            return Promise.reject('please provide object childData!');
        } else {
            if (!data.name) {
                return Promise.reject('please provide name in childData!');
            }
            else {
                var Model = parent.model();
                data.fullname = parent.fullname + '.' + data.name;
                return Model.findOrCreate({
                    where: {
                        fullname: data.fullname,
                        spaceId: data.spaceId
                    },
                    default: data
                }).spread(function (entity, created) {
                    if (created) {
                        return Promise.resolve(entity);
                    } else {
                        return entity.update(data);
                    }
                })
            }
        }
    }

    this.getChildren = function (parent, type) {
        var childType = 'all';
        if (['leaf', 'direct'].indexOf(type)) {
            childType = type;
        }

        if (typeof parent === 'object' && !Array.isArray(parent)) {
            if (parent.Model) {
                var Model = parent.Model;
                return Model.findAll(
                    {
                        where: {
                            spaceId: parent.spaceId,
                            fullname: {
                                $like: parent.fullname + '.%'
                            }
                        }
                    }
                )
            } else {
                return this.find(parent).then(function (oParent) {
                    if (oParent) {
                        var Model = oParent.Model;
                        return Model.findAll(
                            {
                                where: {
                                    spaceId: oParent.spaceId,
                                    fullname: {
                                        $like: oParent.fullname + '.%'
                                    }
                                }
                            }
                        )
                    }
                })
            }
        } else {
            return Promise.reject('please provide object parent!');
        }
    }

    this.getChild = function (parentData, childData) {
        return this.find(parentData).then(function (parent) {
            if (parent) {
                if(typeof childData === 'string'){
                    childData = {
                        name: childData
                    }
                }

                if(typeof childData === 'object'){
                    childData.parent = parent;
                    return this.find(childData);
                } else {
                    return this.getChildren(parent).then(function(children){
                        if(children && children.length > 0){
                            return Promise(children[0]);
                        } else {
                            return Promise.resolve(null);
                        }
                    })
                }
            } else {
                return Promise.reject('invalid parent!');
            }
        })
    }


}

module.exports = TreeObj;