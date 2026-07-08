(function (global) {
  class LayerPipeline {
    constructor() {
      this.createdGroups = [];
    }

    registerGroup(group) {
      if (group && group.name && !this.createdGroups.some(g => g.name === group.name)) {
        this.createdGroups.push(group);
      }
    }

    async createModuleGroup(moduleName, targetLayer) {
      const group = await global.PhotoshopBridge.createGroup(moduleName, targetLayer);
      this.registerGroup(group);
      return group;
    }

    async createMaskForGroup(group, inverted = false) {
      return await global.PhotoshopBridge.createMaskForGroup(group, inverted);
    }

    async addAdjustmentLayer(group, name, params) {
      return await global.PhotoshopBridge.createAdjustmentLayer(group, name, params);
    }

    async resetDocument() {
      // Loop backwards to delete groups so indices don't shift
      for (let i = this.createdGroups.length - 1; i >= 0; i--) {
        const group = this.createdGroups[i];
        try {
          await global.PhotoshopBridge.deleteGroup(group.name);
        } catch (e) {
          console.warn(`Failed to delete group ${group.name}:`, e);
        }
      }
      this.createdGroups = [];
    }

    clear() {
      this.createdGroups = [];
    }
  }

  global.LayerPipeline = LayerPipeline;
})(window);
