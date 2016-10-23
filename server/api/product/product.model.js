'use strict';

import sqldb from '../../sqldb';
import _ from 'lodash';
import TreeObj from '../../sqldb/TreeObj';

var Promise = require('bluebird');
export default function (sequelize, DataTypes) {
	return sequelize.define('Product', {
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
		typeId: {
			type: DataTypes.INTEGER,
			defaultValue: -1
		},
		active: DataTypes.BOOLEAN
	}, {
			classMethods: {
				findProduct: function (data) {
					var treeObj = new TreeObj(this);
					return treeObj.find(data);
				},
				//with full include
				getProduct: function (data) {
					var that = this;
					var ProductAttribute = sqldb.ProductAttribute;
					var ProductType = sqldb.ProductType;
					var PermitRole = sqldb.PermitRole;
					this.belongsTo(ProductType, { as: 'type' });
					this.hasMany(ProductAttribute, { as: 'attributes', foreignKey: "ownerId" })
					ProductAttribute.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" })
					return this.findProduct(data).then(function (product) {
						if (product && product.Model) {
							return that.find({
								where: {
									_id: product._id
								},
								include: [
									{
										model: ProductType, as: 'type'
									},
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

				getProducts: function (data) {
					var that = this;
					var ProductAttribute = sqldb.ProductAttribute;
					var PermitRole = sqldb.PermitRole;
					var ProductType = sqldb.ProductType;
					this.hasMany(ProductAttribute, { as: 'attributes', foreignKey: "ownerId" });
					ProductAttribute.hasMany(PermitRole, { as: 'permits', foreignKey: "ownerId" });

					if (typeof data === 'object' && Object.keys(data).length > 0) {
						return that.findAll({
							where: data,
							include: [
								{
									model: ProductType, as: 'type'
								},
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

				addProduct: function (productData) {
					var that = this;
					var treeObj = new TreeObj(this);
					var Attribute = sqldb.ProductAttribute;
					var theProduct;

					return new Promise(function (resolve, reject) {
						if (productData.type && productData.spaceId) {
							var typeData = {};
							typeData.spaceId = productData.spaceId;
							if (typeof productData.type === 'string') {
								typeData.name = productData.type;
							}
							if (typeof productData.type === 'object') {
								typeData = productData.type;
							}
							if (typeData.name && typeData.spaceId) {
								return ProductType.findType(typeData);
							} else {
								return reject('please provide type name and spaceId');
							}
						}
					}).then(function (type) {
						if (type) {
							productData.typeId = type._id;
							return treeObj.findOrCreate(productData, ownerData)
						}
						else {
							return Promise.reject('not find type');
						}
					}).then(function (product) {
						if (product) {
							theProduct = product;
							var ownerData = {
								owner: 'Product',
								ownerId: product._id,
								spaceId: product.spaceId
							}
							if (productData.attributes) {
								return Attribute.addAttributes(productData.attributes, ownerData);
							} else {
								return Promise.resolve(product);
							}
						} else {
							Promise.reject('fail to create product!');
						}
					}).then(function () {
						return that.getProduct(theProduct);
					}).catch(function (err) {
						console.log('error:', err);
					})
				},

				addProducts: function (listData) {
					var that = this;
					if (Array.isArray(listData)) {
						var finalList = [];
						return Promise.each(listData, function (data) {
							return that.addProduct(data, ownerData).then(function (product) {
								finalList.push(product);
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
						owner: "Product",
						ownerId: this._id,
						spaceId: this.spaceId
					}
					return Atrribute.addAttribute(data, ownerData);
				},
				addAttributes: function (listData) {
					var Attribute = sqldb.ProductAttribute;
					var ownerData = {
						owner: "Product",
						ownerId: this._id,
						spaceId: this.spaceId
					}
					return Atrribute.addAttributes(listData, ownerData);
				}
			}
		});
}
