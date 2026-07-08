(function (global) {
  class StrayHairsModule extends global.BaseModule {
    constructor() {
      super("Cheveux Rebelles", {
        strength: 40,
        radius: 20,
        intensity: 50
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Dureté", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Rayon du Pinceau", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Intensité de Fusion", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      // Inverted black mask: retoucher paints white strokes on stray hairs
      const mask = await pipeline.createMaskForGroup(group, true);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      // A Curves boost helps blend painted strokes with background color sampling
      await pipeline.addAdjustmentLayer(group, "Curves", {
        strength: this.params.intensity / 3
      });

      return { group, mask };
    }
  }

  global.StrayHairsModule = StrayHairsModule;
})(window);
