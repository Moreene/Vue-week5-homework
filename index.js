import productModal from "./productModal.js";

const app = Vue.createApp({
    data() {
        return {
            apiUrl: 'https://ec-course-api.hexschool.io/v2',
            apiPath: 'moreene',
            products: [],
            showProduct: {},
            cart: [],
            isLoading: true,
            form: {
                user: {
                    name: '',
                    email: '',
                    tel: '',
                    address: '',
                },
                message: '',
            },
        }
    },
    methods: {
        // 取得所有產品資訊
        getProduct() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/products`)
                .then(res => {
                    this.products = res.data.products;
                    this.isLoading = false;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // spinner
        toggleSpinner(id, refName) {
            const spinnerArray = this.$refs[refName + id];
            const spinner = spinnerArray[0];
            spinner.classList.remove('d-none');
            spinner.classList.add('d-block');
            setTimeout(() => {
                spinner.classList.remove('d-block');
                spinner.classList.add('d-none');
            }, 500)
        },
        // 打開modal
        openModal(id) {
            this.showProduct = this.products.find(item => item.id === id);
            this.toggleSpinner(id, 'spinner');
            setTimeout(() => {
                this.$refs.productModal.openModal();
            }, 500);
        },
        // 加入購物車
        addCart(id, qty = 1) {
            this.toggleSpinner(id, 'cartSpinner');
            setTimeout(() => {
                this.$refs.productModal.hideModal();
            }, 550);
            const cart = {
                qty,
                "product_id": id
            };
            axios.post(`${this.apiUrl}/api/${this.apiPath}/cart`, { "data": cart })
                .then(res => {
                    alert(res.data.message);
                    this.getCart();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 取得購物車
        getCart() {
            axios.get(`${this.apiUrl}/api/${this.apiPath}/cart`)
                .then((res) => {
                    this.cart = res.data.data;
                }).catch((err) => {
                    console.log(err);
                });
        },
        // 更新購物車品項數量
        updateItem(item) {
            const cart = {
                "qty": item.qty,
                "product_id": item.id
            };
            axios.put(`${this.apiUrl}/api/${this.apiPath}/cart/${item.id}`, { "data": cart })
                .then((res) => {
                    alert(res.data.message);
                    this.getCart();
                }).catch((err) => {
                    console.log(err);
                });
        },
        // 刪除單一購物車品項
        delItem(id) {
            this.toggleSpinner(id, 'delSpinner');
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/cart/${id}`)
                .then(res => {
                    alert(res.data.message);
                    this.getCart();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 清空購物車
        delCart() {
            axios.delete(`${this.apiUrl}/api/${this.apiPath}/carts`)
                .then(res => {
                    alert(res.data.message);
                    this.getCart();
                })
                .catch(err => {
                    console.log(err);
                });
        },
        // 表單-手機驗證
        isPhone(value) {
            const phoneNumber = /^(09)[0-9]{8}$/
            return phoneNumber.test(value) ? true : '請輸入09開頭的手機號碼'
        },
        // 表單-提交
        onSubmit() {
            axios.post(`${this.apiUrl}/api/${this.apiPath}/order`, { "data": this.form })
                .then(res => {
                    alert(res.data.message);
                    this.$refs.form.resetForm();
                    this.getCart();
                })
                .catch(err => {
                    console.log(err);
                });
        }
    },
    mounted() {
        this.getProduct();
    }
});

app.component('productModal', productModal);
app.component('loading', VueLoading.Component);
app.component('VForm', VeeValidate.Form);
app.component('VField', VeeValidate.Field);
app.component('ErrorMessage', VeeValidate.ErrorMessage);


Object.keys(VeeValidateRules).forEach(rule => {
    if (rule !== 'default') {
        VeeValidate.defineRule(rule, VeeValidateRules[rule]);
    }
});

// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
    generateMessage: VeeValidateI18n.localize('zh_TW'),
    validateOnInput: false, // 輸入文字時，是否立即進行驗證
});


app.use(VueLoading.LoadingPlugin);
app.mount('#app');