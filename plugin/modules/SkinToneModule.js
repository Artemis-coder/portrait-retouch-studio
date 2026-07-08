(function (global) {
  class SkinToneModule extends global.BaseModule {
    constructor() {
      super("Teint de la Peau", {
        strength: 30,
        radius: 0,
        intensity: 20
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Décalage de Teinte", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Température", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Saturation", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, false);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      // Hue/Saturation targeting reds and yellows to balance skin tone
      await pipeline.addAdjustmentLayer(group, "Hue/Saturation", {
        hue: (this.params.strength - 50) / 2,          // Shift hue ±25 degrees around neutral
        saturation: (this.params.intensity - 50) / 2,  // Adjust saturation
        lightness: 0
      });

      return { group, mask };
    }
  }

  global.SkinToneModule = SkinToneModule;
})(window);
