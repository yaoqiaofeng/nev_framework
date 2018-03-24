<template lang="html">
	<el-main id="login" class="login" v-title="登陆">	
		<div class="login-caption">用户登陆</div>
		<el-form class="login-client" :model="user" :rules="rules" ref="user">
			<el-form-item  prop="username">
				<el-input type="text" placeholder="请输入手机|邮箱|用户名" v-model="user.username" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item  prop="password">
				<el-input type="password" placeholder="请输入登陆密码"  v-model="user.password" auto-complete="off"></el-input>
			</el-form-item>
			<el-form-item>
				<el-checkbox v-model="user.remember">记住登陆</el-checkbox>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="onLogin">								
					<i class="iconfont icon-submit"></i>  登陆
				</el-button>
			</el-form-item>
		</el-form>
	</el-main>
</template>
<style lang="scss">
@import "../../var";
.login {
    background-color: $main-back;
    width: 400px;
    text-align: left;
    border: 1px solid $main-border;
    border-radius : 4px;
    padding: 30px;
    margin: auto;
    .login-caption {
        text-align: center;
        color: $text-gray;
        font-size: 24px;
        line-height: 32px;
        padding-bottom: 30px;
        i{ 
            margin-right: 10px
        }
    }
    .login-client{
        .el-button{
            width: 100%;
        }
    }
}
</style>
<script>
	export default {
		data: function () {
			return {
				user: {
					"username": "",
					"password": "",
					"remember": true
				},
				rules: {
					username: [
						{ required: true, message: '请输入手机|邮箱|用户名', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入登陆密码', trigger: 'blur' }
					]
				}

			}
		},
		methods: {
            async onLogin() {
                if (this.vup.free()) {
                    try {
                        await this.vup.get("/api/user/login", {
                            params: this.user,
                            responseType: "json",
                            load: true
                        });
                        window.location.href = "../redirect";
                    } catch (err) {
                        this.vup.message("登陆错误", err);
                    }
                }
            }
		}
	}
</script>