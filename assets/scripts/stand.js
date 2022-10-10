
const dataPath = ['http://ts.cbkeys.ru/api/getStandsInfo.php', 'http://ts.cbkeys.ru/api/getBranchesDataList.php'];

const template = /*html*/`
<div className="test_stand_list">
    <div className="title_list">
        <div className="stand-name">Наименование</div>
        <div className="stand-master">Master</div>
        <div className="stand-branch">Ветка</div>
        <div className="stand-controls"></div>
    </div>
    <div class="stand" v-for="(stand, index) in allStands">
        <div class="stand-name">
            {{stand.name}}
        </div>
        <div class="stand-master">
            {{stand.master}}
        </div>
        <div class="stand-branch">
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
                @click="redrawButton(index)"
                :disabled="stand.branch !== stand.master"
            >   
                <i className="fas fa-code-branch"></i>
            </button>
            <button
            v-if="stand.status"
            class="btn-green" 
            title="Загрузить ветку"
            @click="choice(stand.name, stand.route, index)"
        >   
            <i className="fas fa-arrow-right"></i>
        </button>
            <button 
                title="Очистить (до master)"
                :disabled="stand.branch == stand.master"
                @click="onBackToMaster(index)"
            >
                <i className="fas fa-arrow-left"></i>
            </button>
            <button 
                title="Обновить (Pull)"
                @click="onBranchPull(index)"
            >
                <i className="fas fa-sync-alt"></i>
            </button>

            <div className="dropdown__container">
                <button @click=" showDropdownList(index) ">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
                <ul v-show="stand.isActive">
                    <li @click="onBranchReset(index)">Сброс</li>
                    <li @click="onComposerUpdate(index)">Composer update</li>
                    <li @click="onComposerInstall(index)">Composer install</li>
                </ul>
            </div>

        </div>
    </div>
</div>
`;

{/* <ul class="dropdown_hidden" v-bind:class="{ dropdown_visible : isActive }"></ul> */}

const App = {
    data() {
        return {
            valueString: [],
            isActive: false
        }
    },
    methods: {
        async onBranchPull(id) {
            let stand = this.$store.state.stands[id];
            data = new FormData;
            data.append('route', stand.route);
            data.append('branch', stand.branch.indexOf('testand-') === 0 ? stand.branch.replace('testand-', '') : stand.branch);
            let response = await fetch('http://ts.cbkeys.ru/api/pullStandBranch.php', {
                method: "POST",
                body: data
            });
            let result = await response.json();
            console.log(result);
            if(!result.ok) {
                alert('Ошибка при пуле изменений, обратитесь к администратору!');
            }
        },
        redrawButton(id) {
            this.$store.dispatch('redrawButtonAction', id);
        },
        choice(stand, route, id) {
            const branch = document.getElementById(stand).value;
            let data = {route, branch, id}
            this.$store.dispatch('changeBranchAction', data);
        },
         async onBackToMaster(id) {
            console.log(this.$store.state.stands[id]);
            let stand = this.$store.state.stands[id];
            data = new FormData;
            data.append('branch', stand.branch);
            data.append('route', stand.route);
            data.append('clear', 1);
            let response = await fetch('http://ts.cbkeys.ru/api/changeBranch.php', {
                method: "POST",
                body: data
            });
            let result = await response.json();
            if(result.ok) {
                this.$store.dispatch("fetchStands");
            } else {
                alert('Ошибка при очистке, обратитесь к администратору!');
                this.$store.dispatch("fetchStands");
            }
        },
        async showDropdownList(index) {

            if (this.allStands[index].isActive) {
                this.allStands[index].isActive = false;
            } else {
                this.allStands[index].isActive = true;
            }
        },
        async onBranchReset(id) {
            console.log(id + ' Сброс OK!');
        },
        async onComposerUpdate(id) {
            console.log(id + ' Composer Up OK!');
        },
        async onComposerInstall(id) {
            console.log(id + ' Composer Inst OK!');
        },
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
            ctx.commit('updateBranches', branches.branches);
        },
        redrawButtonAction({commit}, id) {
            commit('redrawButtonMutation', id)
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
            if(result.ok) {
                params.branch_name = result.branch_name;
                commit('changeBranche', params);
            } else {
                params.branch_name = 'master';
                commit('changeBranche', params);
                alert(result.error);
            }

        }
    },
    mutations: {
        redrawButtonMutation(state, id) {
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
