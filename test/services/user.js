const sinon = require("sinon");
const assert = require("assert");
const tester = require('../tester');
const user = tester.require('services/user');

describe('User', function () {
    describe('#add()', function () {
        it('添加管理员', async function () {
            /*
            assert.throw在判断位于promise触发的错误会无效果，
            需要额外写代码取出错误在判断，
            所以这里添加了一个取错误消息的函数 tester.error
            */
            assert.equal('', await tester.error(user.add({
                username: "admin",
                password: "8888",
                type: "admin"
            }, {
                identity: "admin"
            })));
        });
    });
    describe('#update()', function () {
        it('修改电话号码', async function () {
            assert.equal('', await tester.error(user.update({
                    id: 1,
                    tel: "18718406830"
                }, {
                    identity: "admin"
                })
            ));
        });
    });
    describe('#register()', function () {
        it('用户注册', async function () {
            assert.equal('', await tester.error(user.register({
                    username: "user",
                    password: "8888"
                }, {})));
        });
        it('用户注册，重复注册', async function () {
            assert.equal('用户名已存在，请选择其他用户名！', await tester.error(user.register({
                    username: "user",
                    password: "8888"
                }, {})));
        });
    });
    describe('#login()', function () {
        it('用户登录', async function () {
            assert.equal('user', (await user.login({
                username: "user",
                password: "8888"
            })).username);
        });
    });
    describe('#list()', function () {
        it('普通用户行为', async function () {
            assert.equal('权限不足', await tester.error(user.list({}, {})));
        });
        it('超级用户行为', async function () {
            assert.equal(2, (await user.list({}, {
                identity: "admin"
            })).rows.length);
        });
    })
});