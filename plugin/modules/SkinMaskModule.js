(function (global) {
  class SkinMaskModule extends global.BaseModule {
    constructor() {
      super("Masque de Peau", {
        strength: 40,
        radius: 20,
        intensity: 50
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Contour Progressif", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Lissage", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Plage de Sélection", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      // Create an inverted mask to selectively paint in corrections on skin only
      const mask = await pipeline.createMaskForGroup(group, true);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      // A Hue/Saturation layer to subtly target skin tones is added inside this group
      await pipeline.addAdjustmentLayer(group, "Hue/Saturation", {
        hue: 0,
        saturation: this.params.intensity / 4,
        lightness: 0
      });

      return { group, mask };
    }
  }

  global.SkinMaskModule = SkinMaskModule;
})(window);
