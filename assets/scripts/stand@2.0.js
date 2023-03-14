const { useToast } = primevue.usetoast; // Для сообщений

const TwoCell = {
  components: {
    "p-menu":         primevue.menu, // Выпадающее меню
    "p-button":       primevue.button, // Кнопки
    "p-autocomplete": primevue.autocomplete // Autocomplete для выбора ветки
  },
  
  props: ['standsProp', 'allDataBranch'],
  
  setup(props) {
        
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
    const selectedBranch = Vue.ref('');
    
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
      hideInput(props.standsProp.data.name);
      
      if (props.standsProp.data.branch !== 'master') {
        setStatus(3);
      };
      
      if (linkBranchName.value.includes('testand-')) {
        linkBranchName.value = linkBranchName.value.replace('testand-', '');
      };
    });
    
    // Статус Preloader
    const statusPreloader = Vue.ref(false);
    
    // Событие главной кнопки для смены состояния
    function changeBranch(event) {
      let status = statusBranch.value;
      
      if (status === 1) {
        setStatus(2);
        showInput(props.standsProp.data.name);
      } else if (status === 2) {
        onBranchPut();
      } else if (status === 3) {
        onBackToMaster();
      }
    }
    
    // Прнимает число от 1 до 3
    function setStatus(num) {
      statusBranch.value = num;
    }
    
    function checkStatus() {
      return statusBranch.value;
    }
    
    // id - атрибут id на autocomplete
    function showInput(id) {
      document.querySelector(`#${id}`).style.position = 'relative';
      document.querySelector(`#${id}`).style.visibility = 'visible';
      document.querySelector(`#${id} input`).focus();
    }
    
    // id - атрибут id на autocomplete
    function hideInput(id) {
      document.querySelector(`#${id}`).style.position = 'absolute';
      document.querySelector(`#${id}`).style.visibility = 'hidden';
    }
    
    function hasInputFocus(event) {
      event.target.select();
    }
    
    // Запускает показ уведомления, внизу слева
    function startToast(status, name, additional) {
      const textList = {
        onBranchPut: {
          title: 'Размещение ветки',
          message: {
            success: 'Успешное размещение!',
            warn: 'Не удалось рзместить ветку'
          }
        },
        onBackToMaster: {
          title: 'Очистить (до master)',
          message: {
            success: 'Успешно!',
            warn: 'Ошибка при очистке, обратитесь к администратору!'
          }
        },
        onBranchPull: {
          title: 'Обновить (Pull)',
          message: {
            success: 'Ветка обновлена',
            warn: 'Ошибка при пуле изменений, обратитесь к администратору!',
            master: 'Нельзя выполнить для ветки master'
          }
        },
        onBranchReset: {
          title: 'Сброс ветки',
          message: {
            success: 'Успешно восстановлен в исходное состояние master',
            warn: 'Возникла непредвиденная ошибка, обратитесь к администратору!',
          }
        },
        onComposerInstall: {
          title: 'Composer install',
          message: {
            success: 'Успешная установка зависимостей',
            warn: 'Возникла непредвиденная ошибка, обратитесь к администратору!',
          }
        },
        onComposerUpdate: {
          title: 'Composer update',
          message: {
            success: 'Успешное обновление',
            warn: 'Возникла непредвиденная ошибка, обратитесь к администратору!',
          }
        }
      }
      
      toast.add({ 
        severity: status, 
        summary: textList[name].title, 
        detail: (additional) ? textList[name].message[additional] : textList[name].message[status], 
        group: 'bl', 
        life: 4000
      });
    }
    
    // Размещение ветки
    async function onBranchPut() {
      statusPreloader.value = true;
      
      linkBranchName.value = selectedBranch.value.name;
      
      // Работа с api
      /* let data = new FormData();
      data.append("branch", linkBranchName.value);
      data.append("route", props.standsProp.data.route);
      data.append("clear", 0);
      let response = await fetch('../../api/changeBranch.php', {
        method: "POST",
        body: data
      });
      let result = await response.json(); */
      
      let response = await fetch('../../json/changeBranch.json');
      let result = await response.json();
      
      hideInput(props.standsProp.data.name);
      
      if (result.ok && linkBranchName.value !== undefined) {
        setStatus(3);
        startToast('success', 'onBranchPut');
      } else {
        linkBranchName.value = 'master';
        setStatus(1);
        startToast('warn', 'onBranchPut');
      }
      
      statusPreloader.value = false;
    }
    
    // Возвращение на ветку master
    async function onBackToMaster() {
      statusPreloader.value = true;
      
      // Работа с api
      /* let data = new FormData();
      
      data.append("branch", 'testand-' + linkBranchName.value);
      data.append("route", props.standsProp.data.route);
      data.append("clear", 1);
      
      let response = await fetch('../../api/changeBranch.php', {
        method: "POST",
        body: data
      });
      
      let result = await response.json(); */
      
      let response = await fetch('../../json/changeBranch.json');
      let result = await response.json();
      
      if (result.ok) {
        setStatus(1);
        linkBranchName.value = 'master';
        startToast('success', 'onBackToMaster');
      } else {
        startToast('warn', 'onBackToMaster');
      }
      
      statusPreloader.value = false;
    };
    
    // Обновление ветки
    async function onBranchPull() {
      if (linkBranchName.value === 'master') {
        startToast('warn', 'onBranchPull', 'master');
      } else {
        statusPreloader.value = true;
      
        // Работа с api
        /* let data = new FormData();
        data.append("route", props.standsProp.data.route);
        data.append("branch", linkBranchName.value);
        let response = await fetch('../../api/pullStandBranch.php', {
          method: "POST",
          body: data
        });
        let result = await response.json(); */
        
        let response = await fetch('../../json/changeBranch.json');
        let result = await response.json();
        
        if (result.ok) {
          startToast('success', 'onBranchPull');
        } else {
          startToast('warn', 'onBranchPull');
        }
        
        statusPreloader.value = false;
      }
    };
    
    // Принудительный сброс до master
    async function onBranchReset() {
      
      hideInput(props.standsProp.data.name);
      statusPreloader.value = true;
    
      // Работа с api
      /* let data = new FormData();
      data.append("route", props.standsProp.data.route);
      let response = await fetch('../../api/hardReset.php', {
          method: "POST",
          body: data
      });
      let result = await response.json(); */
      
      let response = await fetch('../../json/changeBranch.json');
      let result = await response.json();
      
      if (result.ok) {
        linkBranchName.value = 'master';
        setStatus(1);
        startToast('success', 'onBranchReset');
      } else {
        startToast('warn', 'onBranchReset');
      }
      
      statusPreloader.value = false;
    }
    
    // Установка/обновление зависимостей в composer
    async function onComposerInstall () {
      statusPreloader.value = true;
    
      // Работа с api
      /* let data = new FormData();
      data.append("route", props.standsProp.data.route);
      let response = await fetch('../../api/composerInstall.php', {
          method: "POST",
          body: data
      });
      let result = await response.json(); */
      
      let response = await fetch('../../json/changeBranch.json');
      let result = await response.json();
      
      if (checkStatus() === 2) {
        setStatus(1);
        hideInput(props.standsProp.data.name);
      }
            
      if (result.ok) {
        startToast('success', 'onComposerInstall');
      } else {
        startToast('warn', 'onComposerInstall');
      }
      
      statusPreloader.value = false;
    }
    
    // Обновление composer
    async function onComposerUpdate () {
      statusPreloader.value = true;
    
      // Работа с api
      /* let data = new FormData();
      data.append("route", props.standsProp.data.route);
      let response = await fetch('../../api/composerUpdate.php', {
          method: "POST",
          body: data
      });
      let result = await response.json(); */
      
      let response = await fetch('../../json/changeBranch.json');
      let result = await response.json();
      
      if (checkStatus() === 2) {
        setStatus(1);
        hideInput(props.standsProp.data.name);
      }
      
      if (result.ok) {
        startToast('success', 'onComposerUpdate');
      } else {
        startToast('warn', 'onComposerUpdate');
      }
      
      statusPreloader.value = false;
    }
    
    // Изменение иконки для кнопки
    function changeIcon () {
      let status = statusBranch.value;
      
      if (status === 1) {
        return 'fa-solid fa-code-branch';
      } else if (status === 2) {
        return 'pi pi-arrow-right';
      } else if (status === 3) {
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
    
    // Смена атрибута title для кнопки
    function changeTitle () {
      let status = statusBranch.value;
      
      if (status === 1) {
        return 'Изменить ветку';
      } else if (status === 2) {
        return 'Разместить ветку';
      } else if (status === 3) {
        return 'Очистить (до master)';
      }
    }
        
    // Событие на Esc для закрытия autocomplete
    function cancelEvent () {
      setStatus(1);
      hideInput(props.standsProp.data.name);
    }
        
    // Список стилей
    const styles = Vue.reactive({
      branch: [
        'stands__branch-link',
        'text-purple-200',
        'no-underline',
        'hover:text-purple-300',
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
      onBranchPut,
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
        <a :href="'../../demo.html?' + standsProp.data.name" :class="[styles.branch, [(statusBranch === 2) ? 'hidden-element' : '']]" target="_blank">
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
      
      <p-autocomplete @keyup.esc="cancelEvent" @keyup.enter="changeBranch" @focus="hasInputFocus($event)" @item-select="onBranchPut" class="p-inputtext-sm w-7 stand__autocomplete" inputClass="w-12 stand__input" v-model="selectedBranch" :suggestions="filteredAllDataBranch" @complete="searchBranch($event)" optionLabel="name"  completeOnFocus="true" placeholder="Выберите ветку" :id="standsProp.data.name" delay="0" scrollHeight="300px"></p-autocomplete>
      
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
      // Работа с api
      // let response = await fetch('../../api/getStandsInfo.php');
      // let result = await response.json();
      
      let response = await fetch('../../json/getStandsInfo.json');
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
      
      // Работа с api
      /* let data = new FormData();
      data.append("route", "../tsdb_01");
      let response = await fetch('../../api/getBranchesDataList.php', {
        method: "POST",
        body: data
      });
      let result = await response.json(); */
      
      let response = await fetch('../../json/getBranchesDataList.json');
      let result = await response.json();
      
      for (let branch of result.branches) {
        allDataBranch.value.push({
          name: branch,
          value: branch,
        })
      };
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

