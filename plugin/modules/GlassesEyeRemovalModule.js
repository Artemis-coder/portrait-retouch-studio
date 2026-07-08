(function (global) {
  class GlassesEyeRemovalModule extends global.BaseModule {
    constructor() {
      super("Glasses Eye Removal", {
        strength: 40,
        radius: 25,
        intensity: 45
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Enabled" },
        { key: "opacity", type: "range", label: "Opacity", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Strength", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Feather Radius", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Intensity", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, true);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      await pipeline.addAdjustmentLayer(group, "Brightness/Contrast", {
        brightness: -this.params.strength / 2,
        contrast: -this.params.intensity / 5
      });

      return { group, mask };
    }
  }

  global.GlassesEyeRemovalModule = GlassesEyeRemovalModule;
})(window);
