export default {
    template: '#userProductModal',
    props: ['showProduct'],
    data() {
        return {
            modal: null,
            qty: 1
        };
    },
    methods: {
        openModal() {
            this.qty = 1;
            this.modal.show();
        },
        hideModal() {
            this.modal.hide();
        },
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal, {
            keyboard: false,
            backdrop: 'static'
        });
    }
}