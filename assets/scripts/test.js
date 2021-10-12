
const App = {
    data() {
        return {
            rows: ['hello', 'world', '!!!']
        }
    },
    template: `
    <div className="test_stand_list">
    <div className="title_list">
        <div className="stand-name">Наименование</div>
        <div className="stand-master">Master</div>
        <div className="stand-branch">Ветка</div>
        <div className="stand-controls"></div>
    </div>
    23452345
</div>
    `
}

Vue.createApp(App).mount('#app')