(function (global) {
  class GlassesEyeRemovalModule extends global.BaseModule {
    constructor() {
      super("Correction Reflets Lunettes", {
        strength: 40,
        radius: 25,
        intensity: 45
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Force de Correction", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Rayon Progressif", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Intensité", min: 0, max: 100 }
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
