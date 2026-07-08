(function (global) {
  class BaseModule {
    constructor(name, defaults = {}) {
      this.name = name;
      this.defaults = {
        enabled: true,
        opacity: 100,
        strength: 50,
        radius: 50,
        intensity: 50,
        ...defaults
      };
      this.params = { ...this.defaults };
    }

    isEnabled() {
      return this.params.enabled;
    }

    updateParams(nextParams) {
      this.params = { ...this.params, ...nextParams };
    }

    getControls() {
      return [];
    }

    async apply(pipeline) {
      return pipeline;
    }

    reset() {
      this.params = { ...this.defaults };
    }
  }

  global.BaseModule = BaseModule;
})(window);
