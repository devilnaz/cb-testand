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
    
    const lang = {
      message: {
        error: 'Возникла непредвиденная ошибка, обратитесь к администратору!',
      }
    };
    
    const toast = useToast();

    const menu = Vue.ref();

    // Меню кнопок
    const items = Vue.ref([
      {
        label: 'Сброс',
        icon: 'pi pi-refresh',
        command: () => {
          console.log('сброс');
          onBranchReset();
          // toast.add({severity:'success', summary:'Updated', detail:'Data Updated', life: 3000});
        }
      },
      {
        label: 'Composer install',
        icon: 'pi pi-times',
        command: () => {
          console.log('install');
          onComposerInstall();
          // toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
        }
      },
      {
        label: 'Composer update',
        icon: 'pi pi-times',
        command: () => {
          console.log('update');
          onComposerUpdate();
          // toast.add({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000});
        }
      }
    ]);
    
    const toggle = (event) => {
        menu.value.toggle(event);
    };
    const save = () => {
        toast.add({severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000});
    };
    
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
    
    const statusBranch = Vue.ref(1);
    
    // Установка статуса при инициализации
    Vue.onMounted(() => {
      if (props.standsProp.data.branch !== 'master') {
        statusBranch.value = 3;
      }
    });
    
    // Событие главной кнопки для смены состояния
    function changeBranch(event) {
      // console.log(event.target);
      
      if (statusBranch.value === 1) {
        statusBranch.value = 2;
      } else if (statusBranch.value === 2) {
        statusBranch.value = 3;
        onBranchPut();
      } else if (statusBranch.value === 3) {
        onBackToMaster();
        statusBranch.value = 1;
      }
      
      console.log(statusBranch.value);
    }
    
    // Хранение всех веток
    const allDataBranch = Vue.ref([]);
    
    // Получение всех веток
    async function getAllBranch() {
      let data = new FormData();
      data.append("route", "../tsdb_01");
      let response = await fetch('https://ts.cbkeys.ru/api/getBranchesDataList.php', {
        method: "POST",
        body: data
      });
      let result = await response.json();
      
      allDataBranch.value = [];
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
    
    // Размещение ветки
    async function onBranchPut() {
      if (linkBranchName.value !== '') {
        let data = new FormData();
        data.append("branch", linkBranchName.value);
        data.append("route", props.standsProp.data.route);
        data.append("clear", 0);
        let response = await fetch('https://ts.cbkeys.ru/api/changeBranch.php', {
            method: "POST",
            body: data
        });
        let result = await response.json();
        if(result.ok) {
            // console.log('result.branch_name: ', result.branch_name);
            toast.add({ severity: 'success', summary: 'Размещение ветки', detail: 'Успешное размещение ветки', group: 'bl', life: 3000});
        } else {
            linkBranchName.value = 'master';
            statusBranch.value = 1;
            toast.add({ severity: 'warn', summary: 'Pull ветки', detail: result.error, group: 'bl', life: 10000});
        }
      }
    }
    
    // Возвращение на ветку master
    async function onBackToMaster() {
      let data = new FormData();
      data.append("branch", 'testand-' + linkBranchName.value);
      data.append("route", props.standsProp.data.route);
      data.append("clear", 1);
      
      let response = await fetch('https://ts.cbkeys.ru/api/changeBranch.php', {
        method: "POST",
        body: data
      });
      
      let result = await response.json();
      // console.log('onBackToMaster result: ', result);
      
      if(result.ok){
        linkBranchName.value = 'master';
        console.log('selectedCountry1: ', selectedCountry1);
      } else {
        alert('Ошибка при очистке, обратитесь к администратору!');
      }
      
    };
    
    // Обновление ветки
    async function onBranchPull() {
      
      let data = new FormData();
      data.append("route", props.standsProp.data.route);
      data.append("branch", linkBranchName.value.indexOf('testand-') === 0 ? linkBranchName.value.replace('testand-', '') : linkBranchName.value);
      let response = await fetch('https://ts.cbkeys.ru/api/pullStandBranch.php', {
        method: "POST",
        body: data
      });
      let result = await response.json();
      console.log('result: ', result);
      
      if(result.ok){
        toast.add({ severity: 'success', summary: 'Pull ветки', detail: 'Ветка обновлена', group: 'bl', life: 3000});
      } else {
        toast.add({ severity: 'warn', summary: 'Pull ветки', detail: lang.message.error, group: 'bl', life: 10000});
      }
      
    };
    
    // Принудительный сброс до master
    async function onBranchReset() {
        let data = new FormData();
        data.append("route", props.standsProp.data.route);
        let response = await fetch('https://ts.cbkeys.ru/api/hardReset.php', {
            method: "POST",
            body: data
        });
        let result = await response.json();
        console.log(result);
        
        if(result.ok){
          statusBranch.value = 1;
          toast.add({severity:'success', summary:'Сброс ветки', detail: 'Успешно сброшен до master', group: 'bl', life: 3000});
        } else {
          toast.add({severity:'success', summary:'Сброс ветки', detail: lang.message.error, group: 'bl', life: 10000});
        }
    }
    
    // Обновление composer
    async function onComposerUpdate () {
        let data = new FormData();
        data.append("route", props.standsProp.data.route);
        let response = await fetch('https://ts.cbkeys.ru/api/composerUpdate.php', {
            method: "POST",
            body: data
        });
        let result = await response.json();
        console.log(result.log);
        
        if(result.ok){
          toast.add({severity:'success', summary:'Composer update', detail: 'Успешное обновление', group: 'bl', life: 3000});
        } else {
          toast.add({severity:'success', summary:'Composer update', detail: lang.message.error, group: 'bl', life: 10000});
        }
    }

    // Установка/обновление зависимостей в composer
    async function onComposerInstall () {
        let data = new FormData();
        data.append("route", props.standsProp.data.route);
        let response = await fetch('https://ts.cbkeys.ru/api/composerInstall.php', {
            method: "POST",
            body: data
        });
        let result = await response.json();
        console.log(result.log);
        
        if(result.ok){
          toast.add({severity:'success', summary:'Composer install', detail: 'Успешная установка зависимостей', group: 'bl', life: 3000});
        } else {
          toast.add({severity:'success', summary:'Composer install', detail: lang.message.error, group: 'bl', life: 10000});
        }
    }
    
    // Изменение иконки для кнопки
    function changeIcon () {
      if (statusBranch.value === 1) {
        return 'pi pi-github';
      } else if (statusBranch.value === 2) {
        return 'pi pi-angle-double-right';
      } else if (statusBranch.value === 3) {
        return 'pi pi-angle-double-left';
      }
    };
    
    // Изменение цвета кнопки
    function changeColor () {
      if (statusBranch.value === 2) {
        return 'background-color: var(--blue-400);';
      }
    };
    
    // Смена атрибута title для кнопок
    function changeTitle () {
      if (statusBranch.value === 1) {
        return 'Изменить ветку';
      } else if (statusBranch.value === 2) {
        return 'Разместить ветку';
      } else if (statusBranch.value === 3) {
        return 'Очистить (до master)';
      }
    }
    
    // Выбор значения в autocomplete
    function inputSelect (input) {
      // console.log('select');
      linkBranchName.value = input.value.name;
      statusBranch.value === 3;
    }
    
    // Список стилей
    const styles = Vue.reactive({
      branch: [
        'stands__branch-link',
        'text-white-alpha-90',
        'no-underline',
        'hover:text-purple-200',
      ],
      button: ['stands__btn', 'stands__btn_change'],
    });
    
    // Состояние названия ветки
    const linkBranchName = Vue.ref(props.standsProp.data.branch);
    
    return { 
      linkBranchName,
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
      statusBranch,
      inputSelect,
      allDataBranch,
      onBackToMaster,
      onBranchPull,
    };
  },
  
  template: /*html*/`
    <!-- Обозначение для отрисовки сообщений -->
    <p-toast></p-toast>
    <p-toast position="bottom-left" group="bl"></p-toast>
    
    <div class="stand__cell">
      <div>
        <a :href="'https://ts.cbkeys.ru/' + standsProp.data.name" :class="[styles.branch, [(statusBranch === 2) ? 'hidden-element' : '']]" target="_blank">
          {{ linkBranchName }}
        </a>
      </div>
      
      <p-autocomplete @item-select="inputSelect($event)" :class="[(statusBranch === 1 || statusBranch === 3) ? 'hidden-element' : '']" class="p-inputtext-sm" forceSelection v-model="selectedCountry1" :suggestions="filteredCountries" @complete="searchCountry($event)" optionLabel="name"  completeOnFocus="true"></p-autocomplete>
      
      <div class="stand__buttonset">
        <span class="p-buttonset">
          <p-button @click="changeBranch" :class="styles.button" :style="changeColor()" :icon="changeIcon()" :title="changeTitle()"></p-button>
          <p-button @click="onBranchPull" :class="styles.button" icon="pi pi-sync" title="Обновить (Pull)"></p-button>
          <p-button type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"></p-button>
          <!-- Выпадающее меню с кнопками -->
          <p-menu id="overlay_menu" ref="menu" :model="items" :popup="true"></p-menu>
        </span>
      </div>
    </div>
  `,
}

const Table = {
  components: {
    'p-datatable': primevue.datatable,
    'p-column':    primevue.column,
    'two-cell':    TwoCell,
    'p-autocomplete': primevue.autocomplete
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

