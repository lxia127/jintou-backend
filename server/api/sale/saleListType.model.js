'use strict';

import sqldb from '../../sqldb';
import _ from 'lodash';
var Promise = require('bluebird');
import TreeObj from '../../sqldb/TreeObj';

export default function (sequelize, DataTypes) {
	return sequelize.define('SaleListType', {
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
					var Attribute = sqldb.SaleListAttribute;
					var PermitRole = sqldb.PermitRole;
					var Permit = sqldb.Permit;
					var Role = sqldb.Role;
					PermitRole.belongsTo(sqldb.Permit, { as: 'permit' });
					PermitRole.belongsTo(sqldb.Role, { as: 'role' });
					this.hasMany(Attribute, { as: 'attributes', foreignKey: "ownerId" })
					Attribute.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" })
					return this.findType(data).then(function (type) {
						if (type && type.Model) {
							return that.find({
								where: {
									_id: type._id
								},
								include: [
									{
										model: SaleListAttribute, as: 'attributes',
										where: {
											owner: 'SaleListType'
										},
										include: [
											{
												model: PermitRole, as: "permits",
												include: [
													{
														model: Permit, as: 'permit'
													},
													{
														model: Role, as: 'role'
													}
												],
												required: false,
												where: {
													owner: 'SaleListAttribute'
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
					var Attribute = sqldb.SaleListAttribute;
					var PermitRole = sqldb.PermitRole;
					var Permit = sqldb.Permit;
					var Role = sqldb.Role;
					PermitRole.belongsTo(sqldb.Permit, { as: 'permit' });
					PermitRole.belongsTo(sqldb.Role, { as: 'role' });
					this.hasMany(Attribute, { as: 'attributes', foreignKey: "ownerId" });
					Attribute.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" });

					if (typeof data === 'object' && Object.keys(data).length > 0) {
						return that.findAll({
							where: data,
							include: [
								{
									model: SaleListAttribute, as: 'attributes',
									where: {
										owner: 'SaleListType'
									},
									include: [
										{
											model: PermitRole, as: "permits",
											include: [
												{
													model: Permit, as: 'permit'
												},
												{
													model: Role, as: 'role'
												}
											],
											required: false,
											where: {
												owner: 'SaleListAttribute'
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
					var Attribute = sqldb.SaleListAttribute;
					var theType;
					return treeObj.findOrCreate(typeData, ownerData).then(function (type) {
						if (type) {
							theType = type;
							var ownerData = {
								owner: 'SaleListType',
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
				},

				updateType: function (updateData, findData) {
					var treeObj = new TreeObj(this);
					return treeObj.update(updateData, findData).then(function (oType) {
						return this.getType(oType);
					});
				},
			},
			instanceMethods: {
				addAttribute: function (data) {
					var Attribute = sqldb.SaleListAttribute;
					var ownerData = {
						owner: "SaleListType",
						ownerId: this._id,
						spaceId: this.spaceId
					}
					return Atrribute.addAttribute(data, ownerData);
				},
				addAttributes: function (listData) {
					var Attribute = sqldb.SaleListAttribute;
					var ownerData = {
						owner: "SaleListType",
						ownerId: this._id,
						spaceId: this.spaceId
					}
					return Atrribute.addAttributes(listData, ownerData);
				}
			}
		});
}
