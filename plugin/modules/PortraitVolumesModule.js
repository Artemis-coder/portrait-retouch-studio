(function (global) {
  class PortraitVolumesModule extends global.BaseModule {
    constructor() {
      super("Portrait Volumes", {
        strength: 45,
        radius: 60,
        intensity: 40
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Enabled" },
        { key: "opacity", type: "range", label: "Opacity", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Volume Strength", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Mask Softness", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Intensity", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, false);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      // Sculpt face volumes via Curves adjustment
      await pipeline.addAdjustmentLayer(group, "Curves", {
        strength: this.params.strength,
        intensity: this.params.intensity
      });

      return { group, mask };
    }
  }

  global.PortraitVolumesModule = PortraitVolumesModule;
})(window);
