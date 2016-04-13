/**
 * Created by xujiazhe on 16/4/10.
 */

var mongodb = require('./db');
var dateFormat = require('dateformat');

function Order(order) {
  this.ip = order.ip;
  this.action = order.action;
  this.id = order.id;
  this.orderno = order.orderno;
  this.date = dateFormat(Date.now(), "yyyy-mm-dd,HH:MM:ss");
  this.title = order.title;
  this.username = order.username;
  this.mobile = order.mobile;
  this.address = order.address;
  this.count = order.count;
  this.size = order.size;
  this.color = order.color;
  this.gbook = order.gbook;
  
};

module.exports = Order;

//存储订单信息
Order.prototype.save = function(callback) {
  //要存入数据库的订单文档
  var order = {
/*
{
  "ip": "北京北京",
  "action": "save",
  "id": "184",
  "orderno": "O-201641021757",
  "title": "AIR MAX90",
  "username": "徐加哲",
  "mobile": "18710134910",
  "address": "被竞",
  "count": "1",
  "size": "36",
  "color": "黑色",
  "gbook": "12"
}
 */
    ip: this.ip,
    action: this.action,
    id: this.id,
    orderno: this.orderno,
    date: this.date,
    title: this.title,
    username: this.username,
    mobile: this.mobile,
    address: this.address,
    count: this.count,
    size: this.size,
    color: this.color,
    gbook: this.gbook
  };
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 orders 集合
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //将订单数据插入 orders 集合
      collection.insert(order, {
        safe: true
      }, function (err, order) {
        mongodb.close();
        if (err) {
          return callback(err);//错误，返回 err 信息
        }
        callback(null, order[0]);//成功！err 为 null，并返回存储后的订单文档
      });
    });
  });
};

Order.getAll = function(callback){
    //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 orders 集合
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找订单名（name键）值为 name 一个文档
      collection.find().sort({orderno:-1}).toArray(function(err, orders){
        callback(err, orders);//成功！返回查询的订单信息
        mongodb.close();
      });
    });
  });
}
//读取订单信息
Order.get = function(orderno, callback) {
  //打开数据库
  mongodb.open(function (err, db) {
    if (err) {
      return callback(err);//错误，返回 err 信息
    }
    //读取 orders 集合
    db.collection('orders', function (err, collection) {
      if (err) {
        mongodb.close();
        return callback(err);//错误，返回 err 信息
      }
      //查找订单名（name键）值为 name 一个文档
      collection.findOne({
        orderno: orderno
      }, function (err, order) {
        mongodb.close();
        if (err) {
          return callback(err);//失败！返回 err 信息
        }
        callback(null, order);//成功！返回查询的订单信息
      });
    });
  });
};