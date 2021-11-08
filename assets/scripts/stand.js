const dataPath = ['http://ts.cbkeys.ru/api/getStandsInfo.php', 'http://ts.cbkeys.ru/api/getBranchesDataList.php'];

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
            <div v-if="$store.state">
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
                <a :href="stand.route" style="display: none; " v-bind:id="'link_' + stand.name">link</a>
            </div>
            
            
        </div>
        <div className="stand-controls">
            <button 
                title="Изменить ветку"
                @click="choice(stand.name, stand.route)"
                
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
// :class="{ 'btn-green' : $store.state.isChange }"
const App = {
    data() {
        return {
            valueString: [],
        }
    },
    methods: {
        onChangeBranch() {
            console.log('change');
        },
        editBranch() {
            console.log('edit');
        },
        valueRecord(event) {
            console.log(event.target.value);
            // event.target.value = valueString;
        },
        choice(stand, route) {
            // console.log(stand);
            const inputBranch = document.getElementById(stand);
            let data = new FormData();
            data.append("branch", inputBranch.value.slice(1));
            data.append("route", route);
            data.append("clear", 0);
            let response = fetch('http://ts.cbkeys.ru/api/changeBranch.php', {
                method: "POST",
                body: data
            });
            
           console.log(response);
            if (inputBranch.value !== '') {
                inputBranch.setAttribute("style", "display: none;");
                const linkText = document.getElementById('link_' + stand);
                linkText.setAttribute("style", "display: block; ");
                linkText.innerHTML = inputBranch.value;
            }
            
            
            




            // const xClass = false;
            // event.target.classList.remove('activeItem')
            // if(this.$store.state.isChange == false) {
            //     this.$store.state.isChange = true;
            //     // event.target.classList.add('activeItem')
            // } else if (this.$store.state.isChange == true) {
            //     this.$store.state.isChange = false;
            //     // event.target.classList.add('activeItem')
            // }
            
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
        isChange: true,
        loading: false,
        inputIsSelect: true,
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
            //let response = await fetch('http://ts.cbkeys.ru/api/getBranchesDataList.php');
            //let response = await fetch('http://dev.cb-server.com/clientbase/distr/branches');
            let branches = await response.json();
             console.log(branches);
            ctx.commit('updateBranches', branches.branches);
        }
    },
    mutations: {
        updateStands(state, rows) {
            state.stands = rows;
        },
        updateBranches(state, branches) {
            state.branches = branches;
        },
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
