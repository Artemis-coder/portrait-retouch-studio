(function (global) {
  class EyeBundleModule extends global.BaseModule {
    constructor() {
      super("Eye Bundle", {
        strength: 30,
        radius: 20,
        intensity: 50
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Enabled" },
        { key: "opacity", type: "range", label: "Opacity", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Eye Brightness", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Eye Contrast", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Eye Sharpening", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, true);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      await pipeline.addAdjustmentLayer(group, "Brightness/Contrast", {
        brightness: this.params.strength / 2,
        contrast: this.params.radius / 2
      });

      await pipeline.addAdjustmentLayer(group, "Curves", {
        strength: this.params.intensity / 2
      });

      return { group, mask };
    }
  }

  global.EyeBundleModule = EyeBundleModule;
})(window);
