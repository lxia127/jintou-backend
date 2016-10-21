'use strict';

import sqldb from '../../sqldb';
import _ from 'lodash';
var Promise = require('bluebird');
import TreeObj from '../../sqldb/TreeObj';

export default function (sequelize, DataTypes) {
	return sequelize.define('ProductType', {
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

				findType: function (data) {
					var treeObj = new TreeObj(this);
					return treeObj.find(data);
				},

				getType: function (data) {
					var that = this;
					return this.findType(data).then(function (type) {
						if (type && type.Model) {
							return that.find({
								where: {
									_id: type._id
								},
								include: [
									{
										model: ProductAttribute as 'attributes'
									}
								]
							})
						}
					})
				},

				addType: function (typeData, ownerData) {
					var that = this;
					var treeObj = new TreeObj(this);
					var Attribute = sqldb.ProductAttribute;
					var theType;
					return treeObj.addChild(typeData, ownerData).then(function (type) {
						if (type) {
							theType = type;
							var ownerData = {
								owner: 'ProductType',
								ownerId: type._id,
								spaceId: type.spaceId
							}
							if (typeData.attributes) {
								return Attribute.addAttributes(typeData.attributes, ownerData);
							} else {
								return Promise.resolve(null);
							}
						}
					}).then(function(){
						return that.getType(theType);
					})
				},

			},
			instanceMethods: {
				addAttribute: function(data){
					var Attribute = sqldb.ProductAttribute;
					var ownerData = {
						owner: "ProductType",
						ownerId: this._id,
						spaceId: this.spaceId
					}
					return Atrribute.addAttribute(data, ownerData);
				},
				addAttributes: function(listData){
					var Attribute = sqldb.ProductAttribute;
					var ownerData = {
						owner: "ProductType",
						ownerId: this._id,
						spaceId: this.spaceId
					}
					return Atrribute.addAttributes(listData, ownerData);
				}
			}
		});
}
