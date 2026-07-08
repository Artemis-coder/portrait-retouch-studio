(function (global) {
  class FabricModule extends global.BaseModule {
    constructor() {
      super("Fabric", {
        strength: 40,
        radius: 15,
        intensity: 30
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Enabled" },
        { key: "opacity", type: "range", label: "Opacity", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Texture Strength", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Sharpness", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Saturation", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, true);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      await pipeline.addAdjustmentLayer(group, "Brightness/Contrast", {
        contrast: this.params.strength / 2
      });

      await pipeline.addAdjustmentLayer(group, "Hue/Saturation", {
        saturation: this.params.intensity / 2
      });

      return { group, mask };
    }
  }

  global.FabricModule = FabricModule;
})(window);
