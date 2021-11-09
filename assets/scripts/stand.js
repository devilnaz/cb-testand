const dataPath = ['http://ts.cbkeys.ru/api/getStandsInfo.php', 'http://ts.cbkeys.ru/api/getBranchesDataList.php'];

const template = `
<div className="test_stand_list">
    <div className="title_list">
        <div className="stand-name">Наименование</div>
        <div className="stand-master">Master</div>
        <div className="stand-branch">Ветка</div>
        <div className="stand-controls"></div>
    </div>
    <div className="stand" v-for="(stand, index) in allStands">
        <div className="stand-name">
            {{stand.name}}
        </div>
        <div className="stand-master">
            {{stand.master}}
        </div>
        <div className="stand-branch">
            <div v-if="stand.status">
                <input
                    :id="stand.name"
                    type="text" 
                    ref='' 
                    value='' 
                    placeholder="Ветка" 
                    onKeyDown=''
                    onChange='' 
                    list='branches'
                    style=""
                />
                <datalist id="branches">
                   <option v-for="branch in allBranches" :value="branch"> {{branch.name}} </option>
                </datalist>
            </div>
            <a v-if="!stand.status" :href="stand.route" :id="'link_' + stand.name">{{stand.branch}}</a>
            <a  
                v-if="!stand.status"
                :href="stand.route"
                style="display: none;
                "v-bind:id="'link_' + stand.name"
            >link</a>
            
        </div>
        <div className="stand-controls">
            <button
                v-if="!stand.status" 
                title="Изменить ветку"
                @click="callNewAction(index)"
            >   
                <i className="fas fa-code-branch"></i>
            </button>
            <button
            v-if="stand.status" 
            title="Загрузить ветку"
            @click="choice(stand.name, stand.route, index)"
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
    data() {
        return {
            valueString: [],
        }
    },
    methods: {
        callNewAction(id) {
            this.$store.dispatch('newAction', id);
        },
        choice(stand, route, id) {
            console.log(stand, route,  id);
            const branch = document.getElementById(stand).value;
            let data = {route, branch, id}
            this.$store.dispatch('changeBranchAction', data);
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
        stands: [],
        branches: [],
    }),
    actions: {
        async fetchStands(ctx) {
            let response = await fetch(dataPath[0]);
            let rows = await response.json();
            console.log(rows);
            ctx.commit('updateStands', rows);
        },
        async fetchBranches(ctx) {
            let data = new FormData();
            data.append("route", '../ts_01');
            let response = await fetch(dataPath[1], { 
                method: "POST",
                body: data
             });
            let branches = await response.json();
             console.log(branches);
            ctx.commit('updateBranches', branches.branches);
        },
        newAction({commit}, id) {
            commit('testMutation', id)
        },
        async changeBranchAction({commit}, params) {
            let data = new FormData();
            data.append("branch", params.branch);
            data.append("route", params.route);
            data.append("clear", 0);
            let response = await fetch('http://ts.cbkeys.ru/api/changeBranch.php', {
                method: "POST",
                body: data
            });
            let result = await response.json();
            console.log(result);
            params.branch_name = result.branch_name;
            commit('changeBranche', params);
        }
    },
    mutations: {
        testMutation(state, id) {
            state.stands[id] = {...state.stands[id], status: '1'};
        },
        updateStands(state, rows) {
            state.stands = rows;
        },
        updateBranches(state, branches) {
            state.branches = branches;
        },
        changeBranche(state, params) {
            state.stands[params.id] = {...state.stands[params.id], branch: params.branch_name};
            state.stands[params.id] = {...state.stands[params.id], status: 0};
        }
    },
    getters: {
        getStands: state => {
            return state.stands;
        },
        getBranches: state => {
            return state.branches;
        },
    },
  });

Vue.createApp(App)
.use(store)
.mount('#app');
