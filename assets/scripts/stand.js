

const template = `
<div className="test_stand_list">
    <div className="title_list">
        <div className="stand-name">Наименование</div>
        <div className="stand-master">Master</div>
        <div className="stand-branch">Ветка</div>
        <div className="stand-controls"></div>
    </div>
    <div className="stand" v-for="stand in allStands">
        <div className="stand-name">
            {{stand.name}} 
        </div>
        <div className="stand-master">
            {{stand.master}}
        </div>
        <div className="stand-branch">
            <div v-if="$store.state.isChange">
                <input
                    type="text" 
                    ref='' 
                    value='' 
                    placeholder="Ветка" 
                    onKeyDown=''
                    onChange='' 
                    list='branches'
                />
                <datalist id="branches">
                   <option v-for="branch in allBranches" :value="branch"> {{branch.name}} </option>
                </datalist>
            </div>
            <div v-else>
                <a href="#">{{stand.master}}</a>
            </div>
            
        </div>
        <div className="stand-controls">
            <button 
                title="Изменить ветку"
                @click="$store.state.isChange ? 'this.onChangeBranch' : 'this.editBranch'"
            >   
                <i className="fas fa-code-branch"></i>
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
            console.log('change');
        },
        editBranch() {
            console.log('edit');
        }
    },
    async mounted() {
        await this.$store.dispatch("fetchStands");
        await this.$store.dispatch("fetchBranches");
    },
    computed: {
        allStands() {
            return this.$store.getters.getStands;
        },
        allBranches() {
            return this.$store.getters.getBranches;
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
        branches: [],
        route: '',
        isChange: false                                      ,
        loading: false,
        inputIsSelect: true,
    }),
    actions: {
        async fetchStands(ctx) {
            let response = await fetch('http://ts.cbkeys.ru/api/getStandsInfo.php');
            let rows = await response.json();
            console.log(rows);
            ctx.commit('updateStands', rows);
        },
        async fetchBranches(ctx) {
            let data = new FormData();
            data.append("route", '../ts_01');
            let response = await fetch('./api/getBranchesDataList.php', { 
                method: "POST",
                body: data
             });
            //let response = await fetch('http://ts.cbkeys.ru/api/getBranchesDataList.php');
            //let response = await fetch('http://dev.cb-server.com/clientbase/distr/branches');
            let branches = await response.json();

            ctx.commit('updateBranches', branches.branches)
        }
    },
    mutations: {
        updateStands(state, rows) {
            state.stands = rows;
        },
        updateBranches(state, branches) {
            state.branches = branches;
        }
    },
    getters: {
        getStands: state => {
            return state.stands;
        },
        getBranches: state => {
            return state.branches;
        } 
    }
  });

Vue.createApp(App)
.use(store)
.mount('#app');

