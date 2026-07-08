(function (global) {
  class FabricModule extends global.BaseModule {
    constructor() {
      super("Détails Vêtements", {
        strength: 40,
        radius: 15,
        intensity: 30,
        color: "#3a6bc5",
        colorMode: 50
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "color", type: "color", label: "Couleur du Vêtement" },
        { key: "colorMode", type: "range", label: "Intensité Couleur", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Texture", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Netteté", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Saturation", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const Bridge = global.PhotoshopBridge;
      const target = await Bridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);

      await Bridge.setGroupOpacity(group, this.params.opacity);

      // 1. Sélectionner le sujet via l'IA Photoshop
      await Bridge.executeAsModal(async () => {
        // Sélectionner le calque de base (Background ou le calque principal)
        const doc = await Bridge.getActiveDocument();
        if (doc && doc.layers) {
          const bgLayer = doc.layers[doc.layers.length - 1];
          if (bgLayer) {
            try { doc.activeLayer = bgLayer; } catch (e) { /* ignore */ }
          }
        }

        // Sélectionner le Sujet
        await Bridge.selectSubject();

        // Créer un calque de couleur unie avec la sélection active comme masque
        // La sélection du sujet inclut peau + vêtements.
        // Le mode de fusion "Couleur" ne changera que la teinte sans toucher aux détails/luminosité
        await Bridge.addSolidColorLayer(
          this.params.color,
          "color",
          this.params.colorMode
        );

        // Désélectionner
        await Bridge.deselectAll();
      });

      // 2. Ajustement de contraste pour renforcer la texture du tissu
      if (this.params.strength > 0) {
        await pipeline.addAdjustmentLayer(group, "Brightness/Contrast", {
          contrast: Math.round(this.params.strength / 2)
        });
      }

      // 3. Ajustement de saturation
      if (this.params.intensity > 0) {
        await pipeline.addAdjustmentLayer(group, "Hue/Saturation", {
          saturation: Math.round(this.params.intensity / 2)
        });
      }

      return { group };
    }
  }

  global.FabricModule = FabricModule;
})(window);
