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