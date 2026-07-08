(function (global) {
  class WhiteTeethModule extends global.BaseModule {
    constructor() {
      super("Blanchiment des Dents", {
        strength: 35,
        radius: 15,
        intensity: 30
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Niveau de Blanchiment", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Contour Progressif", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Contrôle Saturation", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      // Inverted black mask – the user paints over teeth to reveal the whitening effect
      const mask = await pipeline.createMaskForGroup(group, true);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      // Desaturate yellows and boost lightness for natural whitening effect
      await pipeline.addAdjustmentLayer(group, "Hue/Saturation", {
        hue: 0,
        saturation: -Math.round(this.params.intensity * 0.8),
        lightness: Math.round(this.params.strength * 0.3)
      });

      return { group, mask };
    }
  }

  global.WhiteTeethModule = WhiteTeethModule;
})(window);
