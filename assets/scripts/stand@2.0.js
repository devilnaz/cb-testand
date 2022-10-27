const { useToast } = primevue.usetoast; // Для сообщений

const TwoCell = {
  components: {
    "p-menu":         primevue.menu, // Выпадающее меню
    "p-button":       primevue.button, // Кнопки
    "p-autocomplete": primevue.autocomplete // Autocomplete для выбора ветки
  },
  
  props: ['standsProp', 'allDataBranch'],
  
  setup(props) {
    
    // Список с текстом
    const lang = {
      message: {
        error: 'Возникла непредвиденная ошибка, обратитесь к администратору!',
        backToMaster: 'Ошибка при очистке, обратитесь к администратору!',
        pull: 'Ошибка при пуле изменений, обратитесь к администратору!',
        pullMaster: 'Нельзя выполнить для ветки master ',
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
          onBranchReset();
        }
      },
      {
        label: 'Composer install',
        icon: 'pi pi-times',
        command: () => {
          onComposerInstall();
        }
      },
      {
        label: 'Composer update',
        icon: 'pi pi-times',
        command: () => {
          onComposerUpdate();
        }
      }
    ]);
    
    // Событие кнопки, которая открывает меню
    const toggle = (event) => {
        menu.value.toggle(event);
    };
    
    // Выбранная ветка в autocomplete
    const selectedBranch = Vue.ref();
    
    // Сформировавшийся список при поиске в autocomplete
    const filteredAllDataBranch = Vue.ref();
    
    // Поиск ветки по списку
    const searchBranch = (event) => {
        if (!event.query.trim().length) {
          filteredAllDataBranch.value = [...props.allDataBranch];
        } else {
          filteredAllDataBranch.value = props.allDataBranch.filter((branch) => {
            return branch.name.toLowerCase().startsWith(event.query.toLowerCase());
          });
        }
    };
    
    // Cтатус ветки
    const statusBranch = Vue.ref(1);
    
    // Название ветки
    const linkBranchName = Vue.ref(props.standsProp.data.branch);
    
    // Установка при инициализации
    Vue.onMounted(() => {
      // if (props.standsProp.data.name == 'tsdb_01') {
      //   statusPreloader.value = true;
      // }
      inputHidden(props.standsProp.data.name);
      if (props.standsProp.data.branch !== 'master') {
        statusBranch.value = 3;
      };
      
      if (linkBranchName.value.includes('testand-')) {
        linkBranchName.value = linkBranchName.value.replace('testand-', '');
      };
    });
    
    // Статус Preloader
    const statusPreloader = Vue.ref(false);
    
    // Событие главной кнопки для смены состояния
    function changeBranch(event) {
      if (statusBranch.value === 1) {
        statusBranch.value = 2;
        inputHidden(props.standsProp.data.name);
      } else if (statusBranch.value === 2) {
        onBranchPut();
      } else if (statusBranch.value === 3) {
        onBackToMaster();
        statusBranch.value = 1;
      }
    }
    
    function inputHidden(input_id) {
      if (statusBranch.value === 2) {
        document.querySelector(`#${input_id}`).style.position = 'relative';
        document.querySelector(`#${input_id}`).style.visibility = 'visible';
        document.querySelector(`#${input_id} input`).focus();
      } else {
        document.querySelector(`#${input_id}`).style.position = 'absolute';
        document.querySelector(`#${input_id}`).style.visibility = 'hidden';
      }
    }
    
    function hasInputFocus(event) {
      event.target.select();
    }
    
    // Размещение ветки
    async function onBranchPut() {
      statusPreloader.value = true;
      
      linkBranchName.value = selectedBranch.value.name;
      // console.log('selectedBranch.value.name: ', selectedBranch.value.name);
      
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
        statusBranch.value = 3;
        inputHidden(props.standsProp.data.name);
        toast.add({ severity: 'success', summary: 'Размещение ветки', detail: 'Успешное размещение!', group: 'bl', life: 4000});
      } else {
        linkBranchName.value = 'master';
        statusBranch.value = 1;
        inputHidden(props.standsProp.data.name);
        toast.add({ severity: 'warn', summary: 'Размещение ветки', detail: result.error, group: 'bl', life: 4000});
      }
      
      statusPreloader.value = false;
    }
    
    // Возвращение на ветку master
    async function onBackToMaster() {
      statusPreloader.value = true;
      
      let data = new FormData();
      data.append("branch", 'testand-' + linkBranchName.value);
      data.append("route", props.standsProp.data.route);
      data.append("clear", 1);
      
      let response = await fetch('https://ts.cbkeys.ru/api/changeBranch.php', {
        method: "POST",
        body: data
      });
      
      let result = await response.json();
      
      if(result.ok){
        linkBranchName.value = 'master';
        toast.add({ severity: 'success', summary: 'Очистить (до master)', detail: 'Успешно!', group: 'bl', life: 4000});
      } else {
        toast.add({ severity: 'warn', summary: 'Очистить (до master)', detail: lang.message.backToMaster, group: 'bl', life: 4000});
      }
      
      statusPreloader.value = false;
    };
    
    // Обновление ветки
    async function onBranchPull() {
      if (linkBranchName.value === 'master') {
        toast.add({ severity: 'warn', summary: 'Pull ветки', detail: lang.message.pullMaster, group: 'bl', life: 4000});
      } else {
        statusPreloader.value = true;
      
        let data = new FormData();
        data.append("route", props.standsProp.data.route);
        data.append("branch", linkBranchName.value);
        let response = await fetch('https://ts.cbkeys.ru/api/pullStandBranch.php', {
          method: "POST",
          body: data
        });
        let result = await response.json();
        
        if(result.ok){
          toast.add({ severity: 'success', summary: 'Pull ветки', detail: 'Ветка обновлена', group: 'bl', life: 4000});
        } else {
          toast.add({ severity: 'warn', summary: 'Pull ветки', detail: lang.message.pull, group: 'bl', life: 4000});
        }
        
        statusPreloader.value = false;
      }
    };
    
    // Принудительный сброс до master
    async function onBranchReset() {
      statusPreloader.value = true;
    
      let data = new FormData();
      data.append("route", props.standsProp.data.route);
      let response = await fetch('https://ts.cbkeys.ru/api/hardReset.php', {
          method: "POST",
          body: data
      });
      let result = await response.json();
      
      if(result.ok){
        linkBranchName.value = 'master';
        statusBranch.value = 1;
        toast.add({severity:'success', summary:'Сброс ветки', detail: 'Успешно сброшен до master', group: 'bl', life: 4000});
      } else {
        toast.add({severity:'warn', summary:'Сброс ветки', detail: lang.message.error, group: 'bl', life: 4000});
      }
      
      statusPreloader.value = false;
    }
    
    // Обновление composer
    async function onComposerUpdate () {
      statusPreloader.value = true;
    
      let data = new FormData();
      data.append("route", props.standsProp.data.route);
      let response = await fetch('https://ts.cbkeys.ru/api/composerUpdate.php', {
          method: "POST",
          body: data
      });
      let result = await response.json();
      
      if(result.ok){
        toast.add({severity:'success', summary:'Composer update', detail: 'Успешное обновление', group: 'bl', life: 4000});
      } else {
        toast.add({severity:'warn', summary:'Composer update', detail: lang.message.error, group: 'bl', life: 4000});
      }
      
      statusPreloader.value = false;
    }

    // Установка/обновление зависимостей в composer
    async function onComposerInstall () {
      statusPreloader.value = true;
    
      let data = new FormData();
      data.append("route", props.standsProp.data.route);
      let response = await fetch('https://ts.cbkeys.ru/api/composerInstall.php', {
          method: "POST",
          body: data
      });
      let result = await response.json();
      
      if(result.ok){
        toast.add({severity:'success', summary:'Composer install', detail: 'Успешная установка зависимостей', group: 'bl', life: 4000});
      } else {
        toast.add({severity:'warn', summary:'Composer install', detail: lang.message.error, group: 'bl', life: 4000});
      }
      
      statusPreloader.value = false;
    }
    
    // Изменение иконки для кнопки
    function changeIcon () {
      if (statusBranch.value === 1) {
        return 'fa-solid fa-code-branch';
      } else if (statusBranch.value === 2) {
        return 'pi pi-arrow-right';
      } else if (statusBranch.value === 3) {
        return 'pi pi-arrow-left';
      }
    };
    
    // Изменение цвета кнопки
    function changeColor () {
      if (statusBranch.value === 2) {
        return 'background-color: var(--blue-400);';
      } else if (statusBranch.value === 3) {
        return 'background-color: var(--purple-300);';
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
      statusBranch.value = 3;
      inputHidden(props.standsProp.data.name);
      onBranchPut();
    }
    
    function cancelEvent () {
      statusBranch.value = 1;
      inputHidden(props.standsProp.data.name);
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
    
    return {
      linkBranchName,
      selectedBranch,
      filteredAllDataBranch,
      searchBranch,
      items,
      menu,
      toggle,
      styles,
      changeBranch,
      changeIcon,
      changeColor,
      changeTitle,
      statusBranch,
      inputSelect,
      onBackToMaster,
      onBranchPull,
      hasInputFocus,
      cancelEvent,
      statusPreloader,
    };
  },
  
  template: /*html*/`
    <div class="stand__cell">
      <div>
        <a :href="'https://ts.cbkeys.ru/' + standsProp.data.name" :class="[styles.branch, [(statusBranch === 2) ? 'hidden-element' : '']]" target="_blank">
          {{ linkBranchName }}
        </a>
      </div>
      <div class="preloader" v-if="statusPreloader">
        <div class="preloader__ground"></div>
        <div class="preloader__image-wrapper">
          <i class="preloader__image pi pi-spin pi-spinner" style="font-size: 2rem"></i>
        </div>
      </div>
      
      <!--
        autocomplete
        suggestions - Массив предложений для отображения
        forceSelection - Очищает поле, если в предложенных нет такого значения
        scrollHeight - Макс. высота списка
        delay - Задержка перед предложением вариантов после ввода в input
        completeOnFocus - Открывает список при получении фокуса
      -->
      
      <p-autocomplete @keyup.esc="cancelEvent" @keyup.enter="changeBranch" @focus="hasInputFocus($event)" @item-select="inputSelect($event)" class="p-inputtext-sm w-7 stand__autocomplete" inputClass="w-12 stand__input" v-model="selectedBranch" :suggestions="filteredAllDataBranch" @complete="searchBranch($event)" optionLabel="name"  completeOnFocus="true" placeholder="Выберите ветку" :id="standsProp.data.name" delay="0" scrollHeight="300px"></p-autocomplete>
      
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
    'p-toast':     primevue.toast, // Сообщения
    'p-datatable': primevue.datatable, // Таблица
    'p-column':    primevue.column, // Колонки в связке с таблицей
    'two-cell':    TwoCell, // Для веток и кнопок
  },

  setup() {
    const stands = Vue.ref([]);
    const input = Vue.ref(false);
    
    Vue.onMounted(async () => {
      let response = await fetch('https://ts.cbkeys.ru/api/getStandsInfo.php');
      let result = await response.json();

      if (result.length > 0) {
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

    // Способ добавления стилей
    const styles = {
      table: [
        'md:w-9',
        'ml-auto',
        'mr-auto'
      ],
    };

    // Вариант по добавлению класса
    const stockClass = (data) => {
      return [
        {
          'class-master': data.master == 'master',
        }
      ];
    };
    
    // Хранение всех веток
    const allDataBranch = Vue.ref([]);
    
    Vue.onMounted(getAllBranch);
    
    // Получение всех веток
    async function getAllBranch() {
      let data = new FormData();
      data.append("route", "../tsdb_01");
      let response = await fetch('https://ts.cbkeys.ru/api/getBranchesDataList.php', {
        method: "POST",
        body: data
      });
      let result = await response.json();
            
      for (let branch of result.branches) {
        allDataBranch.value.push({
          name: branch,
          value: branch,
        })
      };
      
      // console.log(allDataBranch.value);
    };
    
    function setRowClass() {
      return 'stand__row';
    }
    
    return {
      styles,
      stands,
      stockClass,
      input,
      allDataBranch,
      setRowClass
    }
  },

  template: /*html*/`
    <!-- Обозначение для отрисовки сообщений -->
    <p-toast></p-toast>
    <p-toast position="bottom-left" group="bl"></p-toast>
    
    <div :class="styles.table">
      <p-datatable :value="stands" responsive-layout="scroll" :rowClass="setRowClass">
        <p-column field="name" header="Наименование"></p-column>
        <p-column field="master" header="Master">
          <template #body="standProps">
            <div :class="stockClass(standProps.data)">
              {{standProps.data.master}}
            </div>
          </template>
        </p-column>
        <p-column header="Ветка" class="stand__control">
          <template #body="standProps">
            <two-cell :stands-prop="standProps, allDataBranch">
            </two-cell>
          </template>
        </p-column>
      </p-datatable>
    </div>
  `,
};

const standTable = Vue.createApp(Table);
standTable.use(primevue.config.default);
standTable.use(primevue.toastservice);
standTable.mount("#stands");

