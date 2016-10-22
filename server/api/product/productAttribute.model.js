'use strict';

import sqldb from '../../sqldb';
import _ from 'lodash';
import TreeObj from '../../sqldb/TreeObj';
var Promise = require('bluebird');

export default function (sequelize, DataTypes) {
	return sequelize.define('ProductAttribute', {
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
		owner: {
			type: DataTypes.STRING
		},
		ownerId: {
			type: DataTypes.INTEGER，
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
		type: {
			type: DataTypes.ENUM('string', 'object'),
			defaultValue: 'string'
		},
		active: DataTypes.BOOLEAN
  }, {
			classMethods: {
				getAttribute: function(data){
					if(!isNaN(data) && data > 0){
						return this.findById(data);
					} else if(typeof data === 'object'){
						if(data.Model){
							return data;
						} else if(data.name && data.spaceId){
							var whereData = {
								name: data.name,
								spaceId: data.spaceId
							}
							if(data.owner && data.ownerId && data.ownerId > 0){
								whereData.owner = data.owner;
								whereData.ownerId = data.ownerId;
							}
							return this.find({
								where: whereData
							})
						} else {
							Promise.reject('please provide invalid data!');
						}
					} else {
						Promise.reject('please provide invalid data!');
					}
				},
				addAttribute: function (data, ownerData) {
					if(typeof data === 'object' && !Array.isArray(data)){
						if(data.name && data.value){
							if(!data.owner && ownerData.owner){
								data.owner = ownerData.owner
							}
							if(!data.ownerId && ownerData.ownerId){
								data.ownerId = ownerData.ownerId
							}
							if(!data.spaceId && ownerData.spaceId){
								data.spaceId = ownerData.spaceId
							}
							return this.getAttribute(data).then(function(attr){
								if(attr){
									return Promise.resolve(attr);
								} else {
									this.create(data);
								}
							})
						} else {
							Promise.reject('please provide name and value!');
						}
					} else {
						Promise.reject('invalid data!');
					}
				},
				updateAttribute: function (data, ownerData) {
					if(typeof data === 'object' && !Array.isArray(data)){
						if(data.name && data.value){
							if(!data.owner && ownerData.owner){
								data.owner = ownerData.owner
							}
							if(!data.ownerId && ownerData.ownerId){
								data.ownerId = ownerData.ownerId
							}
							if(!data.spaceId && ownerData.spaceId){
								data.spaceId = ownerData.spaceId
							}
							return this.getAttribute(data).then(function(attr){
								if(attr){
									return attr.update(data);
								} else {
									Promise.reject('no valid attribute find to update!');
								}
							})
						} else {
							Promise.reject('please provide name and value!');
						}
					} else {
						Promise.reject('invalid data!');
					}
				},
				addAttributes: function(listData, ownerData, checkExist){
					if(!checkExist){
						checkExist = true;
					}				
					if(Array.isArray(listData)){
						if(!checkExist){
							var batchData = [];
							listData.forEach(function(item, index){								
								if(!item.spaceId && ownerData.spaceId){
									item.spaceId = ownerData.spaceId;
								}
								if(!item.owner && ownerData.owner){
									item.owner = ownerData.owner;
								}
								if(!item.ownerId && ownerData.ownerId){
									item.ownerId = ownerData.ownerId;
								}

								if(item.name && item.spaceId){
									batchData.push(item);
								}							
							})
							return this.batchCreate(batchData);
						}
						else {
							var finalList = [];
							return Promise.each(listData, function(data){
								return that.addAttribute(data,ownerData).then(function(attr){
									finalList.push(attr);
									return Promise.resolve(null);
								});
							}).then(function(){
								return Promise.resolve(finalList);
							})
						}					
					}
				}
			},
		});
}
