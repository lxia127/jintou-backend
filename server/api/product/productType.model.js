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
					var ProductAttribute = sqldb.ProductAttribute;
					var PermitRole = sqldb.PermitRole;
					this.hasMany(ProductAttribute, { as: 'attributes', foreignKey: "ownerId" })
					ProductAttribute.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" })
					return this.findType(data).then(function (type) {
						if (type && type.Model) {
							return that.find({
								where: {
									_id: type._id
								},
								include: [
									{
										model: ProductAttribute, as: 'attributes',
										include: [
											{
												model: PermitRole, as: "permits",
												required: false,
												where: {
													owner: 'ProductAttribute'
												}
											}
										]
									}
								]
							})
						} else {
							return Promise.resolve(null);
						}
					})
				},

				getTypes: function (data) {
					var that = this;
					var ProductAttribute = sqldb.ProductAttribute;
					var PermitRole = sqldb.PermitRole;
					this.hasMany(ProductAttribute, { as: 'attributes', foreignKey: "ownerId" });
					ProductAttribute.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" });

					if (typeof data === 'object' && Object.keys(data).length > 0) {
						return that.findAll({
							where: data,
							include: [
								{
									model: ProductAttribute, as: 'attributes',
									include: [
										{
											model: PermitRole, as: "permits",
											required: false,
											where: {
												owner: 'ProductAttribute'
											}
										}
									]
								}
							]
						})
					} else {
						return Promise.reject('must provide data for seach types!');
					}
				},

				addType: function (typeData, ownerData) {
					var that = this;
					var treeObj = new TreeObj(this);
					var Attribute = sqldb.ProductAttribute;
					var theType;
					return treeObj.findOrCreate(typeData, ownerData).then(function (type) {
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
								return Promise.resolve(type);
							}
						}
					}).then(function () {
						return that.getType(theType);
					})
				},

				addTypes: function (listData, ownerData) {
					var that = this;
					if (Array.isArray(listData)) {
						var finalList = [];
						return Promise.each(listData, function (data) {
							return that.addType(data, ownerData).then(function (type) {
								finalList.push(type);
								return Promise.resolve(null);
							});
						}).then(function () {
							return Promise.resolve(finalList);
						})
					} else {
						Promise.reject('please provide array data!');
					}
				}
			},
			instanceMethods: {
				addAttribute: function (data) {
					var Attribute = sqldb.ProductAttribute;
					var ownerData = {
						owner: "ProductType",
						ownerId: this._id,
						spaceId: this.spaceId
					}
					return Atrribute.addAttribute(data, ownerData);
				},
				addAttributes: function (listData) {
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
