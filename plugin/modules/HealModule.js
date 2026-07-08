(function (global) {
  class HealModule extends global.BaseModule {
    constructor() {
      super("Heal", {
        strength: 40,
        radius: 35,
        intensity: 60
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Enabled" },
        { key: "opacity", type: "range", label: "Opacity", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Strength", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Radius", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Intensity", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, false);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      await pipeline.addAdjustmentLayer(group, "Curves", {
        strength: this.params.strength
      });
      
      return { group, mask };
    }
  }

  global.HealModule = HealModule;
})(window);
