import Vue from 'vue'
// 按需导入elementUI
import { Button, Form, FormItem, Input, Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// message要这样弄
Vue.prototype.$message = Message
