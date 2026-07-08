(function (global) {
  class DodgeBurnModule extends global.BaseModule {
    constructor() {
      super("Dodge & Burn", {
        strength: 55,
        radius: 45,
        intensity: 50
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Enabled" },
        { key: "opacity", type: "range", label: "Opacity", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Dodge Strength", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Burn Strength", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Density", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, false);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      // Create Dodge layer (curves pulled up)
      await pipeline.addAdjustmentLayer(group, "Curves", {
        strength: this.params.strength
      });
      
      // Create Burn layer (curves pulled down)
      await pipeline.addAdjustmentLayer(group, "Curves", {
        strength: -this.params.radius
      });

      return { group, mask };
    }
  }

  global.DodgeBurnModule = DodgeBurnModule;
})(window);
