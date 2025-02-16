const defaultState = {
  
};

Vue.component("LswTable", {
  template: <div class="lsw_table">
    <div>
        <div style="display: flex; flex-direction: row; align-items: center;">
            <button class="button_separation" v-on:click="showTransformers">All: {{ transformers.length }}</button>
            <button class="button_separation" v-on:click="askForFilter">+Filter</button>
            <button class="button_separation" v-on:click="askForMapper">+Mapper</button>
            <button class="button_separation" v-on:click="askForReducer">+Reducer</button>
            <button class="button_separation" v-on:click="askForSorter">+Sorter</button>
            <div style="flex: 100;"></div>
        </div>
    </div>
    <table>
        <thead>
            <tr>
                <th v-for="header, headerIndex in headers" v-bind:key="'header-' + headerIndex">
                    <div>{{ header }}</div>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row, rowIndex in output" v-bind:key="'row-' + rowIndex">
                <td v-for="column, columnIndex in row" v-bind:key="'column-' + columnIndex">
                    {{ column }}
                </td>
            </tr>
        </tbody>
    </table>
</div>,
  props: {
    initialState: {
      type: Object,
      default: () => ({})
    },
    initialInput: {
      type: Array,
      default: () => []
    },
    initialHeaders: {
      type: Array,
      default: () => []
    }
  },
  data() {
    const state = Object.assign(defaultState, this.initialState);
    const input = [].concat(this.initialInput);
    return {
      headers: this.initialHeaders.length ?? undefined, 
      transformers: [],
      input,
      output: undefined,
      isShowingPanelMain: false,

    };
  },
  methods: {
    cloneInput() {
      return [].concat(this.input);
    },
    askForTransformerOfType(someType) {
      return this.$dialogs.open({
        template: `
          <div>
            <control-box ref="form1" form-id="tempdialog">
              <hidden-control form-id="tempdialog" name="type" initial-value="${someType}" />
              <string-control form-id="tempdialog" name="callbackCode" :multiline="true" label="Write the new ${someType} here:" :on-change="v => value.callback = v" placeholder="it.name === 'Carl' // for example" />
            </control-box>
            <div style="text-align: right; padding-right: 4px;">
              <button v-on:click="() => accept($refs.form1.getValue())">Añadir</button>
              <button v-on:click="() => close()">Cancelar</button>
            </div>
          </div>
        `,
      });
    },
    isValidTransformer(transformer) {
      const isObject = typeof transformer === "object";
      const hasType = typeof transformer.type === "string";
      const hasCallbackCode = typeof transformer.callbackCode === "string";
      const isValid = isObject && hasType && hasCallbackCode;
      console.log("transformer is " + (isValid ? "Valid" : "Invalid"));
      let specificArguments = [];
      if(transformer.type === "filter") {
        specificArguments = specificArguments.concat(["it", "i"]);
      } else if(transformer.type === "mapper") {
        specificArguments = specificArguments.concat(["it", "i"]);
      } else if(transformer.type === "reducer") {
        specificArguments = specificArguments.concat(["out", "it", "i"]);
      } else if(transformer.type === "modifier") {
        specificArguments = specificArguments.concat(["data"]);
      } else if(transformer.type === "sorter") {
        specificArguments = specificArguments.concat(["a", "b"]);
      }
      Object.assign(transformer, {
        callback: new Function(...specificArguments, "return " + transformer.callbackCode)
      });
      return isValid;
    },
    async askForFilter() {
      const answer = await this.askForTransformerOfType("filter");
      if(!this.isValidTransformer(answer)) return;
      this.transformers = this.transformers.concat([answer]);
    },
    async askForReducer() {
      const answer = await this.askForTransformerOfType("reducer");
      if(!this.isValidTransformer(answer)) return;
      this.transformers = this.transformers.concat([answer]);
    },
    async askForMapper() {
      const answer = await this.askForTransformerOfType("mapper");
      if(!this.isValidTransformer(answer)) return;
      this.transformers = this.transformers.concat([answer]);
    },
    async askForReducer() {
      const answer = await this.askForTransformerOfType("reducer");
      if(!this.isValidTransformer(answer)) return;
      this.transformers = this.transformers.concat([answer]);
    },
    async askForModifier() {
      const answer = await this.askForTransformerOfType("modifier");
      if(!this.isValidTransformer(answer)) return;
      this.transformers = this.transformers.concat([answer]);
    },
    async askForSorter() {
      const answer = await this.askForTransformerOfType("sorter");
      if(!this.isValidTransformer(answer)) return;
      this.transformers = this.transformers.concat([answer]);
    },
    showTransformers() {
      return this.$dialogs.open({
        template: `<pre>${JSON.stringify(this.transformers, null, 2)}</pre>`,
      });
    },
    synchronizeOutput(transformers = this.transformers) {
      let temporaryData = this.cloneInput();
      Transform: {
        for(let index=0; index<transformers.length; index++) {
          const transformer = transformers[index];
          if(transformer.type === "filter") {
            temporaryData = temporaryData.filter(transformer.callback);
          } else if(transformer.type === "mapper") {
            temporaryData = temporaryData.map(transformer.callback);
          } else if(transformer.type === "reducer") {
            temporaryData = temporaryData.reduce(transformer.callback, []);
          } else if(transformer.type === "modifier") {
            temporaryData = transformer.callback(temporaryData);
          } else if(transformer.type === "sorter") {
            temporaryData = temporaryData.sort(transformer.callback);
          }
        }
      }
      const temporaryHeaders = new Set();
      Headers: {
        for(let index=0; index<temporaryData.length; index++) {
          const temporaryRow = temporaryData[index];
          const temporaryKeys = Object.keys(temporaryRow);
          temporaryKeys.forEach(k => temporaryHeaders.add(k));
        }
      }
      Update_data: {
        this.headers = temporaryHeaders;
        this.output = temporaryData;
      }
    }
  },
  watch: {
    transformers(value) {
      this.synchronizeOutput();
    }
  },
  mounted() {
    this.synchronizeOutput();
  }
});