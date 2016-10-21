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
				//no include find
				findProduct: function (data) {
					if (typeof data === 'object' && !Array.isArray(data)) {
						if (data.Model) {
							return data;
						}
						else if (data.name && data.spaceId) {
							var findData = {
								name: data.name,
								spaceId: data.spaceId
							}
							if (data.owner && data.ownerId) {
								findData.owner = data.owner;
								findData.ownerId = data.ownerId;
							}
							return this.find({
								where: findData
							})
						} else {
							return Promise.reject('invalid input!');
						}
					} else {
						if (isNaN(data) && data > 0) {
							return this.findById(data);
						}
						else {
							return Promise.reject('invalid input!');
						}
					}
				},
				//with full include
				getProduct: function (data) {
					return this.findProduct(data).then(function (product) {
						return that.find({
							where: {
								_id: product._id
							},
							include: [
								{
									model: ProductCategory as 'type',
									include: [
										{
											model: ProductAttribute as 'attributes'
										}
									]
								},
								{
									model: ProductAttribute as 'attributes'
								}
							]
						});
					})
				},

				add: function (productData) {
					var that = this;
					var pType, pAttributes, product;
					if (typeof productData === 'object' && !Array.isArray(productData)) {
						return this.findObj(productData).then(function (oProduct) {
							if (oProduct) {
								return Promise.resolve(oProduct);
							} else {
								if (productData.name && productData.spaceId) {
									//add type first
									return new Promise(function (resolve, reject) {
										if (productData.type) {
											return that.addType(productData.type).then(function (type) {
												if (type) {
													pType = type;
													return resolve(type);
												}
											})
										} else {
											return resolve(null);
										}
									})
										.then(function () {//add product
											if (pType) {
												productData.typeId = pType._id;
											}
											return that.create(productData);
										})
										.then(function (oProduct) { //add attributes
											product = oProduct;
											if (product) {
												if (productData.attributes) {
													return that.addAttributes(productData.attributes, product).then(function (attributes) {
														if (attributes) {
															pAttributes = attributes;
															return resolve(null);
														}
													})
												} else {
													return resolve(null);
												}
											} else {
												Promise.reject('fail to create product!');
											}

										}).then(function () {
											return that.getProduct(product);
										})

								} else {
									return Promise.reject('please provide unique product name and spaceId!');
								}
							}
						})
					} else {
						Promise.reject('no valid productData!');
					}
				},
				addType: function (typeData) {

				},

			},
			instanceMethods: {
				addAttribute: function (data) {

				},
				addAttributes: function (listData) {

				}
			}
		});
}
