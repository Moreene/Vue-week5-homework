export default {
    template: '#userProductModal',
    props: ['showProduct'],
    data() {
        return {
            modal: null,
            qty: 1
        };
    },
    mounted() {
        this.modal = new bootstrap.Modal(this.$refs.modal, {
            keyboard: false,
            backdrop: 'static'
        });
    }
}