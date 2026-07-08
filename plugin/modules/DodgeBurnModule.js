(function (global) {
  class DodgeBurnModule extends global.BaseModule {
    constructor() {
      super("Dodge & Burn (Éclaircir/Assombrir)", {
        strength: 55,
        radius: 45,
        intensity: 50
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Force Éclaircissement", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Force Assombrissement", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Densité", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group, false);
      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);

      // Create Dodge layer (curves pulled up)
      await pipeline.addAdjustmentLayer(group, "Curves", {
        strength: this.params.strength
      });
      
      // Create Burn layer (curves pulled down)
      await pipeline.addAdjustmentLayer(group, "Curves", {
        strength: -this.params.radius
      });

      return { group, mask };
    }
  }

  global.DodgeBurnModule = DodgeBurnModule;
})(window);
