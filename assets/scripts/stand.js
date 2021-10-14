

const template = `
<div className="test_stand_list">
    <div className="title_list">
        <div className="stand-name">Наименование</div>
        <div className="stand-master">Master</div>
        <div className="stand-branch">Ветка</div>
        <div className="stand-controls"></div>
    </div>
    <div className="stand">
        <div className="stand-name" v-for="link in $store.getters['getCount']">
            stand-name {{link}}
        </div>
        <div className="stand-master">
            stand-master
        </div>
        <div className="stand-branch">
            stand-branch
        </div>
        <div className="stand-controls">
            <button 
                title="Изменить ветку"
                @click="this.onChangeBranch"
            >   
                <i className="fas fa-arrow-right"></i>
            </button>
            <button 
                title="Очистить (до master)"
            >
                <i className="fas fa-arrow-left"></i>
            </button>
            <button 
                title="Обновить (Pull)"
            >
                <i className="fas fa-sync-alt"></i>
            </button>
            <DropDownButton 
                
            />
        </div>
    </div>
</div>
`
const store = Vuex.createStore({
    state: () => ({
        links: ['link1', 'link2'],
        id: '',
        name: [],
        master: '',
        branch: '',
        route: '',
        isChange: false,
        loading: false,
        inputIsSelect: true,
    }),
    actions: {},
    mutations: {},
    getters: {
        getCount() {
            return store.state.links
        }
    }
  })

const App = {
    store,
    data() {
        return {

        }
    },
    methods: {
        onChangeBranch() {
            console.log(22);
        }
    },
    async mounted() {
        console.log(this.$store.state.links);
        let response = await fetch('http://ts.cbkeys.ru/api/getStandsInfo.php')
        let rows = response.json()
        console.log(rows)
    },
    template
}

Vue.createApp(App)
.use(store)
.mount('#app')

