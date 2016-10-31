'use strict';

import sqldb from '../../sqldb';
import _ from 'lodash';
import TreeObj from '../../sqldb/TreeObj';

var Promise = require('bluebird');
export default function (sequelize, DataTypes) {
	return sequelize.define('SaleList', {
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
		package: DataTypes.STRING,
		circleId: {
			type: DataTypes.INTEGER,
			defaultValue: -1
		},
		typeId: {
			type: DataTypes.INTEGER,
			defaultValue: -1
		},
		active: DataTypes.BOOLEAN
	}, {
			classMethods: {
				findSaleList: function (data) {
					var treeObj = new TreeObj(this);
					return treeObj.find(data);
				},
				//with full include
				getSaleList: function (data) {
					var that = this;
					var Attribute = sqldb.SaleAttribute;
					var Type = sqldb.SaleListType;
					var PermitRole = sqldb.PermitRole;
					this.belongsTo(Type, { as: 'type' });
					var Permit = sqldb.Permit;
					var Role = sqldb.Role;
					PermitRole.belongsTo(sqldb.Permit, { as: 'permit' });
					PermitRole.belongsTo(sqldb.Role, { as: 'role' });
					this.hasMany(Attribute, { as: 'attributes', foreignKey: "ownerId" });
					this.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" });
					Attribute.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" });
					return this.findSaleList(data).then(function (sList) {
						if (sList && sList.Model) {
							return that.find({
								where: {
									_id: sList._id
								},
								include: [
									{
										model: Type, as: 'type',
									},
									{
										model: PermitRole, as: "permits",
										include: [
											{
												model: Permit, as: 'permit',
												required: false
											},
											{
												model: Role, as: 'role',
												required: false
											}
										],
										required: false,
										where: {
											owner: 'SaleList'
										}
									},
									{
										model: Attribute, as: 'attributes',
										where: {
											owner: 'SaleList'
										},
										include: [
											{
												model: PermitRole, as: "permits",
												include: [
													{
														model: Permit, as: 'permit',
														required: false
													},
													{
														model: Role, as: 'role',
														required: false
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

				getAllSaleList: function (data) {
					var that = this;
					var SaleListAttribute = sqldb.SaleListAttribute;
					var PermitRole = sqldb.PermitRole;
					var SaleListType = sqldb.SaleListType;
					this.belongsTo(SaleListType, { as: 'type' });
					var Permit = sqldb.Permit;
					var Role = sqldb.Role;
					PermitRole.belongsTo(sqldb.Permit, { as: 'permit' });
					PermitRole.belongsTo(sqldb.Role, { as: 'role' });
					this.hasMany(SaleListAttribute, { as: 'attributes', foreignKey: "ownerId" });
					SaleList.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" });
					SaleListAttribute.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" });

					if (typeof data === 'object' && Object.keys(data).length > 0) {
						return that.findAll({
							where: data,
							include: [
								{
									model: SaleListType, as: 'type'
								},
								{
									model: SaleListAttribute, as: 'attributes',
									where: {
										owner: 'SaleList'
									},
									include: [
										{
											model: PermitRole, as: "permits",
											include: [
												{
													model: Permit, as: 'permit',
													required: false
												},
												{
													model: Role, as: 'role',
													required: false
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

				addSaleList: function (saleListData, ownerData) {
					var that = this;
					var treeObj = new TreeObj(this);
					var Attribute = sqldb.SaleListAttribute;
					var SaleListType = sqldb.SaleListType;
					var theSaleList;

					return new Promise(function (resolve, reject) {
						if (saleListData.type && (saleListData.spaceId || ownerData.spaceId)) {
							var typeData = {};
							typeData.spaceId = saleListData.spaceId || ownerData.spaceId;
							if (typeof saleListData.type === 'string') {
								typeData.name = saleListData.type;
							}
							if (typeof saleListData.type === 'object') {
								typeData = saleListData.type;
							}
							if (typeData.name && typeData.spaceId) {
								return SaleListType.findType(typeData).then(function (o) {
									return resolve(o);
								});
							} else {
								return reject('please provide type name and spaceId');
							}
						}
					}).then(function (type) {
						if (type) {
							saleListData.typeId = type._id;
							return treeObj.findOrCreate(saleListData, ownerData)
						}
						else {
							return Promise.reject('not find type');
						}
					}).then(function (saleList) {
						if (saleList) {
							theSaleList = saleList;
							var ownerData = {
								owner: 'SaleList',
								ownerId: saleList._id,
								spaceId: saleList.spaceId
							}
							if (saleListData.attributes) {
								return Attribute.addAttributes(saleListData.attributes, ownerData);
							} else {
								return Promise.resolve(saleList);
							}
						} else {
							Promise.reject('fail to create saleList!');
						}
					}).then(function () {
						return that.getSaleList(theSaleList);
					}).catch(function (err) {
						console.log('error:', err);
					})
				},

				addBatchSaleList: function (listData, ownerData) {
					var that = this;
					if (Array.isArray(listData)) {
						var finalList = [];
						return Promise.each(listData, function (data) {
							return that.addSaleList(data, ownerData).then(function (saleList) {
								finalList.push(saleList);
								return Promise.resolve(null);
							});
						}).then(function () {
							return Promise.resolve(finalList);
						})
					} else {
						Promise.reject('please provide array data!');
					}
				},

				updateSaleList: function (updateData, findData) {
					var treeObj = new TreeObj(this);
					return treeObj.update(updateData, findData).then(function (p) {
						return this.getSaleList(p);
					});
				},
			},
			instanceMethods: {
				addAttribute: function (data) {
					var Attribute = sqldb.SaleListAttribute;
					var ownerData = {
						owner: "SaleList",
						ownerId: this._id,
						spaceId: this.spaceId
					}
					return Atrribute.addAttribute(data, ownerData);
				},
				addAttributes: function (listData) {
					var Attribute = sqldb.SaleListAttribute;
					var ownerData = {
						owner: "SaleList",
						ownerId: this._id,
						spaceId: this.spaceId
					}
					return Atrribute.addAttributes(listData, ownerData);
				}
			}
		});
}
