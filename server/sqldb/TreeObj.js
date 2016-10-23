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

    this.findOrCreate = function (data, ownerData) {
        if (typeof data !== 'object' || Array.isArray(data)) {
            return Promise.reject('please provide object data!');
        } else {
            var spaceId = data.spaceId || ownerData.spaceId
            if (!spaceId) {
                return Promise.reject('please provide spaceId in data or ownerData');
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
                                spaceId: spaceId
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
                            spaceId: spaceId
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
        if (model && model.Model) {
            if (data.name) {
                data.fullname = model.fullname.slice(0, model.fullname.lastIndexOf('.')) + data.name;
            }
            return model.update(data);
        } else {
            return this.find(data).then(function (model) {
                if (model && model.Model) {
                    if (data.name) {
                        data.fullname = model.fullname.slice(0, model.fullname.lastIndexOf('.')) + data.name;
                    }
                    return model.update(data);
                } else {
                    return Promise.reject('fail to find valid model for update!');
                }
            })
        }
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

        return this.find(parent).then(function (oParent) {
            if (oParent) {
                var Model = oParent.Model;
                data.fullname = oParent.fullname + '.' + data.name;
                return Model.findOrCreate({
                    where: {
                        fullname: data.fullname,
                        spaceId: data.spaceId
                    },
                    default: data
                }).spread(function (entity, created) {
                    return Promise.resolve(entity);
                })
            } else {
                Promise.reject('no valid parent find!');
            }
        })
    }

    this.addOrUpdateChild = function (childData, parent) {

        var data = childData;

        return this.find(parent).then(function (oParent) {
            if (oParent) {
                var Model = oParent.Model;
                data.fullname = oParent.fullname + '.' + data.name;
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
            } else {
                Promise.reject('no valid parent find!');
            }
        })
    }

    this.getChildren = function (parent) {

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
            } else {
                return Promise.reject('fail to find valid parent!');
            }
        })

    }

    this.getChild = function (parentData, childData) {
        return this.find(parentData).then(function (parent) {
            if (parent) {
                if (typeof childData === 'string') {
                    childData = {
                        name: childData
                    }
                }

                if (typeof childData === 'object') {
                    childData.parent = parent;
                    return this.find(childData);
                } else {
                    return this.getChildren(parent).then(function (children) {
                        if (children && children.length > 0) {
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

    this.getParent = function (childData) {
        return this.find(childData).then(function (child) {
            if (child && child.parentId && child.parentId > 0) {
                return this.find(child.parentId);
            } else {
                return Promise.resolve(null);
            }
        }).catch(function (err) {
            console.log('getParent err:', err);
        })
    }

    this.hasChild = function (parentData) {
        return this.find(parentData).then(function (parent) {
            if (parent) {
                Model = parent.Model;
                return Modal.find({
                    where: {
                        parentId: parent._id
                    }
                }).then(function (child) {
                    if (child) {
                        return Promise.resolve(true);
                    } else {
                        return Promise.resolve(false);
                    }
                })
            } else {
                return Promise.reject('no valid parent find!');
            }
        })
    }

    this.hasParent = function (childData) {
        return this.find(childData).then(function (child) {
            if (child) {
                if (child.parentId && child.parentId > 0) {
                    return Promise.resolve(true);
                }
                else {
                    return Promise.resolve(false);
                }
            } else {
                return Promise.reject('no valid child find!');
            }
        })
    }

    this.isChild = function (childData, parentData) {
        var that = this;
        return this.find(childData).then(function (child) {
            if (child) {
                return that.find(parentData).then(function (parent) {
                    if (parent) {
                        if (parent._id === child.parentId) {
                            return Promise.resolve(true);
                        } else {
                            return Promise.resolve(false);
                        }
                    } else {
                        return Promise.reject('no valid parent find!');
                    }
                })
            } else {
                return Promise.reject('no valid child find!');
            }
        })
    }

    this.isParent = function (parentData, childData) {
        return this.isChild(childData, parentData);
    }

}

module.exports = TreeObj;