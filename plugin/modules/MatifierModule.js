(function (global) {
  class MatifierModule extends global.BaseModule {
    constructor() {
      super("Matifier", {
        strength: 50,
        radius: 30,
        intensity: 40
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Enabled" },
        { key: "opacity", type: "range", label: "Opacity", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Matte Strength", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Blur Radius", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Intensity / Threshold", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, true);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      await pipeline.addAdjustmentLayer(group, "Brightness/Contrast", {
        brightness: -this.params.intensity / 5,
        contrast: -this.params.strength / 10
      });

      return { group, mask };
    }
  }

  global.MatifierModule = MatifierModule;
})(window);
