var express = require('express');
var router = express.Router();

var Order = require('../models/orders');
var settings = require('../settings');
// create reusable transporter object using the default SMTP transport
var nodemailer = require("nodemailer");

var path = require('path')
var EmailTemplate = require('email-templates').EmailTemplate
var templatesDir = path.resolve(__dirname, '..', 'templates')
var template = new EmailTemplate(path.join(templatesDir, 'order_summary'))

// 开启一个 SMTP 连接池
var smtpTransport = nodemailer.createTransport("SMTP", {
    host: "smtp.126.com", // 主机
    port: 25, // SMTP 端口
    auth: settings.auth
});


/* GET home page. */
router.get('/', function (req, res, next) {
    // res.sendFile(path.resolve('../example/remai.html'));
    
    Order.getAll(function(err, orders){
        if( err ){
            res.render('error', err);
        }else {
            for(var i = 0;i<orders.length;i++){
                var order = orders[i];
                order.anony = order.username.split('');
                var s = (order.anony.length === 2 )? 0: 1;
                for(;s < order.anony.length-1;s++){
                    order.anony[s] = '*';
                }
                order.username = order.anony.join('');
            }
            res.render('place_order', {'orders':orders});
        }
    })
});

router.post('/', function (req, res, next) {
    try {
        var post_stringify = JSON.stringify(req.body);
        var postArgs = JSON.parse(post_stringify);
    } catch (err) {
        res.render('error', {title: 'Express'});
    }

    var newOrder = new Order({
        ip: postArgs.ip,
        action: postArgs.action,
        id: postArgs.id,
        orderno: postArgs.orderno,
        title: postArgs.title,
        username: postArgs.username,
        mobile: postArgs.mobile,
        address: postArgs.address,
        count: postArgs.count,
        size: postArgs.size,
        color: postArgs.color,
        gbook: postArgs.gbook
    });
    
    Order.get(newOrder.orderno, function (err, order) {
        if (err) {
            return res.redirect('/');
        }
        if (order) {
            return res.redirect('/');//返回注册页
        }
        newOrder.save(function (err, order) {
            if (err) {
                return res.redirect('/');//注册失败返回主册页
            }
            
            res.sendFile('success_order.html',{root: __dirname });
            // 设置邮件内容
            
            template.render({order:newOrder}, function (err, result) {
                // result.html
                // result.text
                // var mailOptions = Object.assign({}, settings.mail
                var mailOptions = settings.mail;
                
                mailOptions.subject = newOrder.username + "购买了商品";
                mailOptions.html = result.html;
                mailOptions.text = result.text;
                
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log("Message sent: " + response.message);
                    }
                    smtpTransport.close(); // 如果没用，关闭连接池
                });
            });
        });
    });
});


module.exports = router;
/*

 {
 "ip": "北京北京",
 "action": "save",
 "id": "184",
 "orderno": [
 "O-201641021757",
 "O-201649231813"
 ],
 "title": "AIR MAX90",
 "username": "徐加哲",
 "mobile": "18710134910",
 "address": "被竞",
 "count": "1",
 "product": "-尺码36-数量:",
 "color": "黑色",
 "gbook": "12"
 }

 */