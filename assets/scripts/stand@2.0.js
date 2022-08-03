class ProductService {

    getProductsSmall() {
		return fetch('./assets/scripts/products-small.json').then(res => res.json()).then(d => d.data);
	}

	getProducts() {
		return fetch('./products.json').then(res => res.json()).then(d => d.data);
    }

    getProductsWithOrdersSmall() {
		return fetch('./products-orders-small.json').then(res => res.json()).then(d => d.data);
	}
}


const template = /* html */`

<div :class="styles.table">
  <p-datatable :value="products" responsive-layout="scroll">
      <p-column v-for="col of columns" :field="col.field" :header="col.header" :key="col.field"></p-column>
  </p-datatable>
</div>

<!--
<p-treetable :value="nodes">
    <template #header>
        All stands
    </template>
    <p-column field="name" header="Title" :expander="true"></p-column>
    <p-column field="size" header="Master"></p-column>
    <p-column field="type" header="Branch"></p-column>
    <p-listbox v-model="selectedCity" :options="cities" option-label="name" style="width:15rem"></p-listbox>
    <p-column header-style="width: 10rem" header-class="text-center" body-class="text-center">
        <template #header>
            <p-button type="button" icon="pi pi-cog"></p-button>
        </template>
        <template #body>
            <p-button type="button" icon="pi pi-search" class="p-button-success" style="margin-right: .5em"></p-button>
            <p-button type="button" icon="pi pi-pencil" class="p-button-warning"></p-button>
        </template>
    </p-column>
    <template #footer>
        <div style="text-align:left">
            <p-button icon="pi pi-refresh"></p-button>
        </div>
    </template>
</p-treetable> -->

<!--
<div class="card">
    <p-treetable>
        <p-column v-for="item in standList">{{item}}</p-column>
    </p-treetable>
</div> -->

<!--
<div class="card">
    <p-datatable :value="products" responsive-layout="scroll">
        <p-column field="code" header="Code"></p-column>
        <p-column field="name" header="Name"></p-column>
        <p-column field="category" header="Category"></p-column>
        <p-column field="quantity" header="Quantity"></p-column>
    </p-datatable>
</div> -->
`

const Table = {
  setup() {

      const productService = Vue.ref(new ProductService());

      Vue.onMounted(() => {
        productService.value.getProductsSmall().then(data => products.value = data);
      })


      const columns = Vue.ref([
          {field: 'code', header: 'Наименование'},
          {field: 'name', header: 'Master'},
          {field: 'category', header: 'Ветка'},
          {field: 'quantity', header: ''}
      ]);
      const products = Vue.ref();

      return { columns, products }
  },
  data() {
    return {
      request: {
        getStandsInfo: {
          url: 'https://ts.cbkeys.ru/api/getStandsInfo.php',
          response: '',
        },
      },
      standList: [],
      styles: {
        table: [
          'md:w-9',
          'ml-auto',
          'mr-auto'
        ]
      }
    }
  },
  watch: {
    standList() {
      console.log('Данные изменились');
      console.log(this.standList);
    }
  },
  computed: {

  },
  methods: {
    async getStandsInfo() {
      let test = await fetch(this.request.getStandsInfo.url)
        .then(response => response.json())
        .then(commits => this.standList.push(commits));
      // this.test();
      // this.standList = test;
    },
    test() {
      console.log(this.request.getStandsInfo.response);
    }
  },
  mounted() {
    this.getStandsInfo();
  },
  components: {
      "p-datatable": primevue.datatable,
      "p-column": primevue.column
  },
  template,
};

const standTable = Vue.createApp(Table)
standTable.use(primevue.config.default)
standTable.mount("#stands");

