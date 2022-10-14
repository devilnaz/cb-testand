const { useToast } = primevue.usetoast;

const TwoCell = {
  components: {
    "p-menu": primevue.menu,
    "p-button": primevue.button,
    "p-toast": primevue.toast,
    "p-inputtext": primevue.inputtext,
    "p-autocomplete": primevue.autocomplete
  },
  
  props: ['standsProp', 'testItems'],
  
  setup(props) {
              
    const toast = useToast();

    const menu = Vue.ref();

    const items = Vue.ref([
      {
        label: 'Сброс',
        icon: 'pi pi-refresh',
        command: () => {
            toast.add({severity:'success', summary:'Updated', detail:'Data Updated', life: 3000});
        }
      },
      {
        label: 'Composer install',
        icon: 'pi pi-times',
        command: () => {
            toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
        }
      },
      {
        label: 'Composer update',
        icon: 'pi pi-times',
        command: () => {
            toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
        }
      }
    ]);
    
    const selectedCountry1 = Vue.ref();
    const filteredCountries = Vue.ref();
    
    const searchCountry = (event) => {
      
        if (!event.query.trim().length) {
          console.log('first');
          
          getAllBranch();
        }
        else {
          console.log('second');
          
          filteredCountries.value = allDataBranch.value.filter((branch) => {
            return branch.name.toLowerCase().startsWith(event.query.toLowerCase());
          });
        }
    };
        
    const toggle = (event) => {
        menu.value.toggle(event);
    };
    const save = () => {
        toast.add({severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000});
    };
    
    const statusBranch = Vue.ref(1);
    
    function changeBranch(event) {
      // console.log(event.target);
      
      if (statusBranch.value === 1) {
        statusBranch.value = 2;
      } else if (statusBranch.value === 2) {
        statusBranch.value = 3;
      } else if (statusBranch.value === 3) {
        onBackToMaster();
        statusBranch.value = 1;
      }
      
      console.log(statusBranch.value);
    }
    
    function placeBranch() {
      
    }
    
    const allDataBranch = Vue.ref([]);
    
    async function getAllBranch() {
      let data = new FormData();
      data.append("route", "../tsdb_01");
      let response = await fetch('https://ts.cbkeys.ru/api/getBranchesDataList.php', {
        method: "POST",
        body: data
      });
      let result = await response.json();
      
      // console.log(result.branches);
      for (let branch of result.branches) {
        allDataBranch.value.push({
          name: branch,
          value: branch,
        })
      };
      // console.log(allDataBranch.value);
      
      filteredCountries.value = [...allDataBranch.value];
    };
    
    // Возвращение на ветку master
    async function onBackToMaster() {
      // console.log('standsProp.data', props.standsProp);
      
      let data = new FormData();
      data.append("branch", props.standsProp.data.branch);
      data.append("route", props.standsProp.data.route);
      data.append("clear", 1);
      
      console.log('data: ', data);
      
      let response = await fetch('https://ts.cbkeys.ru/api/changeBranch.php', {
        method: "POST",
        body: data
      });
      let result = await response.json();
      console.log('result: ', result);
      
      if(result.ok){
        console.log('selectedCountry1: ', selectedCountry1);
      } else {
        alert('Ошибка при очистке, обратитесь к администратору!');
      }
      
    };
    
    async function onBranchPull() {
      
      let data = new FormData();
      data.append("route", props.standsProp.data.route);
      data.append("branch", props.standsProp.data.branch.indexOf('testand-') === 0 ? props.standsProp.data.branch.replace('testand-', '') : props.standsProp.data.branch);
      let response = await fetch('https://ts.cbkeys.ru/api/pullStandBranch.php', {
        method: "POST",
        body: data
      });
      let result = await response.json();
      console.log('result: ', result);
      
      if(!result.ok){
        alert('Ошибка при пуле изменений, обратитесь к администратору!');
      }
      
    };
    
    function changeIcon () {
      if (statusBranch.value === 1) {
        return 'pi pi-github';
      } else if (statusBranch.value === 2) {
        return 'pi pi-angle-double-right';
      } else if (statusBranch.value === 3) {
        return 'pi pi-angle-double-left';
      }
    };
    
    function changeColor () {
      if (statusBranch.value === 1) {
        
      } else if (statusBranch.value === 2) {
        return 'background-color: var(--blue-400);';
      }
    };
    
    function changeTitle () {
      if (statusBranch.value === 1) {
        return 'Изменить ветку';
      } else if (statusBranch.value === 2) {
        return 'Разместить ветку';
      } else if (statusBranch.value === 3) {
        return 'Очистить (до master)';
      }
    }
    
    /*  async onBranchReset(id) {
            console.log(id + ' Сброс OK!');
        },
        async onComposerUpdate(id) {
            console.log(id + ' Composer Up OK!');
        },
        async onComposerInstall(id) {
            console.log(id + ' Composer Inst OK!');
        }, */
    
    function inputSelect (input) {
      console.log(input.value);
    }
    
    const styles = Vue.reactive({
      branch: [
        'stands__branch-link',
        'text-white-alpha-90',
        'no-underline',
        'hover:text-purple-200',
      ],
      button: ['stands__btn', 'stands__btn_change'],
    });
    
    return { 
      selectedCountry1,
      filteredCountries,
      searchCountry,
      items,
      menu,
      toggle,
      save,
      styles,
      changeBranch,
      changeIcon,
      changeColor,
      changeTitle,
      // changeHidden,
      statusBranch,
      inputSelect,
      allDataBranch,
      onBackToMaster,
      onBranchPull
    };
  },
  
  template: /*html*/`
    <div class="stand__cell">
      <div>
        <a :href="'https://ts.cbkeys.ru/' + standsProp.data.name" :class="[styles.branch, [(statusBranch === 2) ? 'hidden-element' : '']]" target="_blank">
          {{ standsProp.data.branch }}
        </a>
      </div>
      
      <p-autocomplete @item-select="inputSelect($event)" :class="[(statusBranch === 1 || statusBranch === 3) ? 'hidden-element' : '']" class="p-inputtext-sm" forceSelection v-model="selectedCountry1" :suggestions="filteredCountries" @complete="searchCountry($event)" optionLabel="name"  completeOnFocus="true"></p-autocomplete>
      
      <div class="stand__buttonset">
        <span class="p-buttonset">
          <p-button @click="changeBranch" :class="styles.button" :style="changeColor()" :icon="changeIcon()" :title="changeTitle()"></p-button>
          <!--<p-button :class="styles.button" icon="pi pi-arrow-left" title="Очистить (до master)"></p-button>-->
          <p-button @click="onBranchPull" :class="styles.button" icon="pi pi-sync" title="Обновить (Pull)"></p-button>
          <p-button type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"></p-button>
          <p-menu id="overlay_menu" ref="menu" :model="items" :popup="true">
          </p-menu>
        </span>
      </div>
    </div>
  `,
}

const Table = {
  components: {
    'p-datatable': primevue.datatable,
    'p-column':    primevue.column,
    // 'stand-buttons': standButtons,
    'two-cell': TwoCell,
    "p-autocomplete": primevue.autocomplete
  },

  setup() {
    const stands = Vue.ref([]);
    const input = Vue.ref(false);
    
    Vue.onMounted(async () => {
      let response = await fetch('https://ts.cbkeys.ru/api/getStandsInfo.php');
      let result = await response.json();
      console.log('result: ', result);

      if (result.length > 0) {
        // console.log(stands);
        stands.value = result.map(stand => {
          return {
            name:   stand.name,
            master: stand.master,
            route:  stand.route,
            branch: stand.branch,
          }
        });
      }
    });

    const styles = {
      table: [
        'md:w-9',
        'ml-auto',
        'mr-auto'
      ],
    };

  // Для теста
    const stockClass = (data) => {
      return [
        {
          'class-master': data.master == 'master',
        }
      ];
    };
    
    return {
      styles,
      stands,
      stockClass,
      input,
    }
  },

  template: /*html*/`
    <div :class="styles.table">
      <p-datatable :value="stands" responsive-layout="scroll">
        <p-column field="name" header="Наименование"></p-column>
        <p-column field="master" header="Master">
          <template #body="standProps">
            <div :class="stockClass(standProps.data)">
              {{standProps.data.master}}
            </div>
          </template>
        </p-column>
        <p-column header="Ветка">
          <template #body="standProps">
            <two-cell :stands-prop="standProps, testItems">
            </two-cell>
          </template>
        </p-column>
        
        
        
        <!--<p-column field="branch" header="Ветка">
          <template #body="standProps">
            <a :href="standLink(standProps.data)" :class="styles.branch" target="_blank">
              {{ standProps.data.branch }}
            </a>
            <div v-if='input'>input</div>
            
            <stand-buttons 
              @test-ckc='input = !input'
              :data="standProps.data.name == 'tsdb_03' ? undefined : standProps.data"
            ></stand-buttons>
          </template>
        </p-column>
        
        <p-column field="buttons" header="Кнопки">
          <template #body="standProps">
            <stand-buttons 
              @test-ckc='input = !input'
              :data="standProps.data.name == 'tsdb_03' ? undefined : standProps.data"
            ></stand-buttons>
          </template>
        </p-column>-->
        
        
      </p-datatable>
    </div>
    
    {{allBranch}}
    
    
  `,
};

const standTable = Vue.createApp(Table);
standTable.use(primevue.config.default);
standTable.use(primevue.toastservice);
standTable.mount("#stands");

