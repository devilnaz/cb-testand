const { useToast } = primevue.usetoast;

const standButtons = {
  props: {
    data: {
      type: Object,
      default() {
        return {
          name: 'undefined',
          master: 'ADMIN',
          branch: 'The ya`best'
        }
      }
    }
  },
  components: {
    "p-menu": primevue.menu,
    "p-button": primevue.button,
    "p-toast": primevue.toast,
  },

  setup({ data }) {
    // console.log(data);
    const checked = Vue.ref(false);
    
    const styles = {
      button: ['stands__btn', 'stands__btn_change'],
    };
  
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

    // changeBranch($event)
    function changeBranch (event) {
      console.log(event.target);
      console.log(event.target.classList.contains('stands__btn_change'));
    }
    
    function isChecked () {
      return checked.value ? 'pi pi-caret-right' : 'pi pi-share-alt';
    }
    
    function changeColor () {
      return checked.value ? 'background-color: var(--blue-400);' : '';
    }

    const toggle = (event) => {
        menu.value.toggle(event);
    };
    const save = () => {
        toast.add({severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000});
    };

    return {
      styles, items, menu, toggle, save, changeBranch, checked, isChecked, changeColor
    }
  },
  
  template: /*html*/`
    <span class="p-buttonset">
      <p-button @click.self="changeBranch" @click="$emit('testCkc')" @click="checked = !checked" :class="styles.button" :style="changeColor()" :icon="isChecked()" ></p-button>
      <p-button :class="styles.button" icon="pi pi-arrow-left"></p-button>
      <p-button :class="styles.button" icon="pi pi-sync"></p-button>
      <p-button type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"></p-button>
      <p-menu id="overlay_menu" ref="menu" :model="items" :popup="true">
      </p-menu>
    </span>
  `
};

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

    function changeBranch(event) {
      // console.log(event.target);
      // console.log(event.target.classList.contains('stands__btn_change'));
      
      chooseBranch.value = !chooseBranch.value;
      console.log('chooseBranch.value: ', chooseBranch.value);
      
      
    }
    
    const countries = Vue.ref([
        {"name": "Afghanistan", "code": "AF"},
        {"name": "Åland Islands", "code": "AX"},
        {"name": "Albania", "code": "AL"},
        {"name": "Algeria", "code": "DZ"},
        {"name": "American Samoa", "code": "AS"},
        {"name": "Andorra", "code": "AD"},
        {"name": "Angola", "code": "AO"},
        {"name": "Anguilla", "code": "AI"},
        {"name": "Antarctica", "code": "AQ"},
        {"name": "Antigua and Barbuda", "code": "AG"},
        {"name": "Argentina", "code": "AR"},]);
    const selectedCountry1 = Vue.ref();
    const filteredCountries = Vue.ref();
    
    const searchCountry = (event) => {
        setTimeout(() => {
            if (!event.query.trim().length) {
                filteredCountries.value = [...countries.value];
            }
            else {
                filteredCountries.value = countries.value.filter((country) => {
                    return country.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }
        }, 250);
    };
        
    const toggle = (event) => {
        menu.value.toggle(event);
    };
    const save = () => {
        toast.add({severity: 'success', summary: 'Success', detail: 'Data Saved', life: 3000});
    };
    
    const chooseBranch = Vue.ref(false);
    
    function changeIcon () {
      return chooseBranch.value ? 'pi pi-caret-right' : 'pi pi-share-alt';
    }
    
    function changeColor () {
      return chooseBranch.value ? 'background-color: var(--blue-400);' : '';
    }
    
    function changeHidden () {
      return chooseBranch.value ? 'display: none;' : '';
    }
    
    
    const styles = Vue.ref({
      branch: [
        'stands__branch-link',
        'text-white-alpha-90',
        'no-underline',
        'hover:text-purple-200',
        {'hidden-element': chooseBranch.value}
      ],
      button: ['stands__btn', 'stands__btn_change'],
    });
    
    const hiddenStyles = {
      'display': 'none',
    };
    
    return { 
      selectedCountry1,
      filteredCountries,
      searchCountry,
      items, 
      menu, 
      toggle, 
      save, 
      styles,
      hiddenStyles,
      changeBranch, 
      changeIcon, 
      changeColor, 
      changeHidden, 
      chooseBranch, 
    };
  },
  
  template: /*html*/`
    <div>
    <a :href="'https://ts.cbkeys.ru/' + standsProp.data.name" :class="styles.branch" target="_blank">
      {{ standsProp.data.branch }}
      {{styles.branch}}
    </a>
    </div>
    <!--
    <p-autocomplete v-model="selectedItem" :suggestions="filteredItems" @complete="searchItems" :virtual-scroller-options="{ itemSize: 38 }" optionLabel="label" dropdown></p-autocomplete>
    -->
    <p-autocomplete v-model="selectedCountry1" :suggestions="filteredCountries" @complete="searchCountry($event)" optionLabel="name"></p-autocomplete>
    
    <div>
      <span class="p-buttonset">
        <p-button @click="changeBranch" :class="styles.button" :style="changeColor()" :icon="changeIcon()"></p-button>
        <p-button :class="styles.button" icon="pi pi-arrow-left"></p-button>
        <p-button :class="styles.button" icon="pi pi-sync"></p-button>
        <p-button type="button" icon="pi pi-bars" @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"></p-button>
        <p-menu id="overlay_menu" ref="menu" :model="items" :popup="true">
        </p-menu>
      </span>
    </div>
  `,
}

const Table = {
  components: {
    'p-datatable': primevue.datatable,
    'p-column':    primevue.column,
    'stand-buttons': standButtons,
    'two-cell': TwoCell,
    "p-autocomplete": primevue.autocomplete
  },

  setup() {
    const stands = Vue.ref([]);
    const input = Vue.ref(false);
    
    Vue.onMounted(async () => {
      let response = await fetch('https://ts.cbkeys.ru/api/getStandsInfo.php');
      let result = await response.json();

      if (result.length > 0) {
        // console.log(stands);
        stands.value = result.map(stand => {
          return {
            name:   stand.name,
            master: stand.master,
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
      columns: Vue.computed(() => [
        {field: 'name', header: 'Наименование'},
        {field: 'master', header: 'Master'},
        {field: 'branch', header: 'Ветка'},
        {field: 'buttons', header: 'Кнопки'}
      ]),
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
        <p-column>
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
    
    
    
    
  `,
};

const standTable = Vue.createApp(Table);
standTable.use(primevue.config.default);
standTable.use(primevue.toastservice);
standTable.mount("#stands");

