(() => {
  const defaultState = {

  };

  const predefinedPlaceholders = {
    filter: `return it.name === 'Carl'`,
    mapper: `return it.name`,
    reducer: `return out.concat([it])`,
    sorter: `return a >= b ? 1 : -1`,
    modifier: `return all.splice(1,all.length-1,1)`,
  }

  Vue.component("LswTable", {
    template: $template,
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
      askForTransformerOfType(transformerType) {
        return this.$dialogs.open({
          template: `
          <div>
            <control-box ref="form1" form-id="tempdialog">
              <hidden-control form-id="tempdialog" name="type" :initial-value="transformerType" />
              <string-control form-id="tempdialog"
                name="callbackCode" :multiline="true"
                :label="'Write the new ' + transformerType + ' here:'"
                :on-change="v => value.callback = v"
                :placeholder="predefinedPlaceholders[transformerType]"
                :css-styles="{textarea:'min-height:80px;'}" />
            </control-box>
            <div style="text-align: right; padding-right: 4px;">
              <button v-on:click="() => accept($refs.form1.getValue())">Añadir</button>
              <button v-on:click="() => close()">Cancelar</button>
            </div>
          </div>
        `,
          factory() {
            return {
              data() {
                return {
                  predefinedPlaceholders,
                  transformerType,
                }
              }
            }
          }
        });
      },
      isValidTransformer(transformer) {
        const isObject = typeof transformer === "object";
        const hasType = typeof transformer.type === "string";
        const hasCallbackCode = typeof transformer.callbackCode === "string";
        const isValid = isObject && hasType && hasCallbackCode;
        console.log("transformer is " + (isValid ? "Valid" : "Invalid"));
        let specificArguments = [];
        if (transformer.type === "filter") {
          specificArguments = specificArguments.concat(["it", "i"]);
        } else if (transformer.type === "mapper") {
          specificArguments = specificArguments.concat(["it", "i"]);
        } else if (transformer.type === "reducer") {
          specificArguments = specificArguments.concat(["out", "it", "i"]);
        } else if (transformer.type === "modifier") {
          specificArguments = specificArguments.concat(["data"]);
        } else if (transformer.type === "sorter") {
          specificArguments = specificArguments.concat(["a", "b"]);
        }
        Object.assign(transformer, {
          callback: new Function(...specificArguments, transformer.callbackCode)
        });
        return isValid;
      },
      async askForFilter() {
        const answer = await this.askForTransformerOfType("filter");
        if (!this.isValidTransformer(answer)) return;
        this.transformers = this.transformers.concat([answer]);
      },
      async askForReducer() {
        const answer = await this.askForTransformerOfType("reducer");
        if (!this.isValidTransformer(answer)) return;
        this.transformers = this.transformers.concat([answer]);
      },
      async askForMapper() {
        const answer = await this.askForTransformerOfType("mapper");
        if (!this.isValidTransformer(answer)) return;
        this.transformers = this.transformers.concat([answer]);
      },
      async askForReducer() {
        const answer = await this.askForTransformerOfType("reducer");
        if (!this.isValidTransformer(answer)) return;
        this.transformers = this.transformers.concat([answer]);
      },
      async askForModifier() {
        const answer = await this.askForTransformerOfType("modifier");
        if (!this.isValidTransformer(answer)) return;
        this.transformers = this.transformers.concat([answer]);
      },
      async askForSorter() {
        const answer = await this.askForTransformerOfType("sorter");
        if (!this.isValidTransformer(answer)) return;
        this.transformers = this.transformers.concat([answer]);
      },
      async askForGrouper() {
        const answer = await this.askForTransformerOfType("grouper");
        if (!this.isValidTransformer(answer)) return;
        this.transformers = this.transformers.concat([answer]);
      },
      showTransformers() {
        const that = this;
        return this.$dialogs.open({
          template: `<lsw-table-transformers :table="table" />`,
          factory() {
            return {
              data() {
                return {
                  table: that
                };
              }
            }
          }
        });
      },
      synchronizeOutput(transformers = this.transformers) {
        let temporaryData = this.cloneInput();
        Transform: {
          for (let index = 0; index < transformers.length; index++) {
            const transformer = transformers[index];
            if (transformer.type === "filter") {
              temporaryData = temporaryData.filter(transformer.callback);
            } else if (transformer.type === "mapper") {
              temporaryData = temporaryData.map(transformer.callback);
            } else if (transformer.type === "reducer") {
              temporaryData = temporaryData.reduce(transformer.callback, []);
            } else if (transformer.type === "modifier") {
              temporaryData = transformer.callback(temporaryData);
            } else if (transformer.type === "sorter") {
              temporaryData = temporaryData.sort(transformer.callback);
            } else if (transformer.type === "grouper") {
              temporaryData = temporaryData.sort(transformer.callback);
            } else {
              throw new Error("Required parameter «transformer.type» to be a valid string on «LswTable.methods.synchronizeOutput»");
            }
          }
        }
        const temporaryHeaders = new Set();
        Headers: {
          for (let index = 0; index < temporaryData.length; index++) {
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
})();