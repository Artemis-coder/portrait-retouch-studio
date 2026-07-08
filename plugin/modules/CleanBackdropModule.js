(function (global) {
  class CleanBackdropModule extends global.BaseModule {
    constructor() {
      super("Nettoyage du Fond", {
        strength: 30,
        radius: 40,
        intensity: 50
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Nettoyage des Bords", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Rayon du Flou", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Contraste", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, true); // Inverted mask for selective application
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);
      
      // Add a Curves layer to push contrast on background, and a Brightness layer
      await pipeline.addAdjustmentLayer(group, "Brightness/Contrast", {
        brightness: this.params.intensity / 10,
        contrast: this.params.strength / 10
      });
      
      return { group, mask };
    }
  }

  global.CleanBackdropModule = CleanBackdropModule;
})(window);
