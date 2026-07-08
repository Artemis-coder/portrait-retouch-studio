(function (global) {
  class MatifierModule extends global.BaseModule {
    constructor() {
      super("Matifiant (Anti-Brillance)", {
        strength: 50,
        radius: 30,
        intensity: 40
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Force du Matifiant", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Rayon du Flou", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Seuil d'Intensité", min: 0, max: 100 }
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
