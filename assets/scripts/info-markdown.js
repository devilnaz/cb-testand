const markdownBlock = {
  components: {
    "p-accordion": primevue.accordion,
    "p-accordiontab": primevue.accordiontab,
  },
    
  setup() {
    const link = '<link href="./assets/css/info-markdown.css" rel="stylesheet">';
    
    return { link }
  },
  
  template: /*html*/`
    <div class="md:w-9 ml-auto mr-auto mt-3">
      <p-accordion :multiple="true">
        <p-accordiontab header="Информация по стендам">
        
          <zero-md src="./info/markdown.md">
            <template id="markdown" v-html="link">
            </template>
          </zero-md>
          
        </p-accordiontab>
      </p-accordion>
    </div>
  `,
}

const info = Vue.createApp(markdownBlock);
info.use(primevue.config.default);
info.mount('#info-markdown');
