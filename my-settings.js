/**
 * Created by xujiazhe on 16/4/10.
 */


module.exports = {
    cookieSecret: 'sell-goods',
    db: 'sellGoods',
    host: 'localhost',
    port: 27017,
    app_port: 8080,

    mail: {
        from: '"your name" <account@email.com>', // sender address
        to: '***@**.com, ****@***.com', // list of receivers
        subject: "某某某购买了商品某某 at 2016年04月**日", // Subject line
    },
    auth: {
        user: "acount@email.com", // 账号
        pass: "email_password" // 密码
    }
};
