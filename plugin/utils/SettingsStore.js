(function (global) {
  class SettingsStore {
    constructor(namespace) {
      this.namespace = namespace || "portrait-retouch-studio";
      this.storage = global.localStorage;
    }

    load(defaults) {
      try {
        const raw = this.storage.getItem(this.namespace);
        return raw ? { ...defaults, ...JSON.parse(raw) } : defaults;
      } catch (error) {
        return defaults;
      }
    }

    save(data) {
      try {
        this.storage.setItem(this.namespace, JSON.stringify(data));
        return true;
      } catch (error) {
        return false;
      }
    }

    clear() {
      this.storage.removeItem(this.namespace);
    }
  }

  global.SettingsStore = SettingsStore;
})(window);
