

const template = `
<div className="test_stand_list">
    <div className="title_list">
        <div className="stand-name">Наименование</div>
        <div className="stand-master">Master</div>
        <div className="stand-branch">Ветка</div>
        <div className="stand-controls"></div>
    </div>
    <div className="stand">
        <div className="stand-name">
            stand-name 
        </div>
        <div className="stand-master">
            stand-master
        </div>
        <div className="stand-branch">
                
                <input 
                    type="text" 
                    ref='' 
                    value='' 
                    placeholder="Ветка" 
                    onKeyDown=''
                    onChange='' 
                    list=''
                />
                <datalist id="">
                   <option v-for="i in allStands" value="">{{ i.branch }}</option>
                </datalist>
            
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
`;

const App = {
    methods: {
        onChangeBranch() {
            console.log(22);
        }
    },
    async mounted() {
        // console.log(this.$store.state.links);
        // let response = await fetch('http://ts.cbkeys.ru/api/getStandsInfo.php')
        // let rows = await response.json()
        // console.log(rows)
        await this.$store.dispatch("fetchStands");
        console.log(this.$store.state);
    },
    computed: {
        allStands() {
            console.log(999);
            return this.$store.getters.getStands;
        }
    },
    template,
};

const store = Vuex.createStore({
    state: () => ({
        links: ['link1', 'link2'],
        id: '',
        stands: [],
        name: [],
        master: '',
        branch: '',
        route: '',
        isChange: false,
        loading: false,
        inputIsSelect: true,
    }),
    actions: {
        async fetchStands(ctx) {
            let response = await fetch('http://ts.cbkeys.ru/api/getStandsInfo.php');
            let rows = await response.json();

            ctx.commit('updateStands', rows);
        }
    },
    mutations: {
        updateStands(state,rows) {
            state.stands = rows;
        }
    },
    getters: {
        getStands: state => {
            console.log('sfg');
            return state.stands;
        } 
    }
  });

Vue.createApp(App)
.use(store)
.mount('#app');

