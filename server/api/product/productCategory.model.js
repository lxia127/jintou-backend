'use strict';

import sqldb from '../../sqldb';
import _ from 'lodash';
var Promise = require('bluebird');
import TreeObj from '../../sqldb/TreeObj';

export default function (sequelize, DataTypes) {
  return sequelize.define('ProductCategory', {
    _id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
		parentId: {
			type: DataTypes.INTEGER,
			defaultValue: -1
		},
    name: {
      type: DataTypes.STRING
    },
		fullname: {
      type: DataTypes.STRING
    },
		alias: DataTypes.STRING,
		description: DataTypes.STRING,
		data: DataTypes.TEXT,
		spaceId: {
			type: DataTypes.INTEGER,
			defaultValue: -1
		},
		circleId: {
			type: DataTypes.INTEGER,
			defaultValue: -1
		},
		active: DataTypes.BOOLEAN
  }, {
			classMethods: {

				addType: function (typeData) {
					var that = this;
					var treeObj = new TreeObj(this);
					return treeObj.addChild(typeData);
				},

				updateType: function (typeData) {
					var that = this;
					if (typeof typeData !== 'object' || Array.isArray(typeData)) {
						return Promise.reject('please provide object as typeData!');
					} else {
						var typeId = typeData.id || typeData._id || null;
						if (typeId && typeId > 0) {
							return that.findById(typeId).then(function (type) {
								if (typeData.name) {
									type.name = typeData.name;
									type.fullname = type.fullname.substring(0, type.fullname.lastIndexOf('.')) + typeData.name;
								}
								type.alias = typeData.alias || type.alias;
								type.description = typeData.description || type.description;
								//type.parentId = typeData.parentId || type.parentId;
								type.spaceId = typeData.spaceId || type.spaceId;
								type.circleId = typeData.circleId || type.circleId;
								type.active = typeData.active || type.active;
								return type.save();
							})
						} else {
							
						}
						
					}
				}

			},
		});
}
