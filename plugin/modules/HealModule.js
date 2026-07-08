(function (global) {
  class HealModule extends global.BaseModule {
    constructor() {
      super("Correction Boutons & Imperfections", {
        strength: 40,
        radius: 8,
        intensity: 60,
        threshold: 10
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Force de Lissage", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Rayon (Taille Boutons)", min: 1, max: 50 },
        { key: "threshold", type: "range", label: "Seuil de Détection", min: 0, max: 128 },
        { key: "intensity", type: "range", label: "Naturel du Résultat", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const Bridge = global.PhotoshopBridge;
      const target = await Bridge.getActiveLayer();
      const group = await pipeline.createModuleGroup(this.name, target);
      await Bridge.setGroupOpacity(group, this.params.opacity);

      /**
       * Stratégie : Dust & Scratches masqué sur la peau
       * ------------------------------------------------
       * 1. Dupliquer le calque de base
       * 2. Appliquer le filtre "Poussière et Rayures" (Dust & Scratches)
       *    - Ce filtre supprime les petits détails (boutons, pores larges, taches)
       *    - Le rayon contrôle la taille max des imperfections ciblées
       *    - Le seuil empêche de lisser les zones de fort contraste (yeux, lèvres)
       * 3. Ajouter un masque noir (tout est caché par défaut)
       *    - L'utilisateur peut peindre en blanc sur le masque pour révéler
       *      le lissage uniquement là où il y a des boutons
       *    - OU on utilise "Sélectionner le Sujet" pour pré-masquer la peau
       * 4. Créer un calque vide "Retouche Manuelle" au-dessus pour permettre
       *    d'utiliser le Correcteur Localisé manuellement
       */

      await Bridge.executeAsModal(async () => {
        const ps = Bridge.getPhotoshopModule();
        if (!ps) return;
        const doc = ps.app.activeDocument;

        // The target is the layer the user selected before clicking apply
        if (target && target.name !== group.name) {
          try {
            await ps.action.batchPlay([{ _obj: "select", _target: [{_ref: "layer", _id: target.id}] }], {});
          } catch(e) {
            doc.activeLayer = target;
          }
        } else if (doc.layers.length > 0) {
          // Fallback to background
          doc.activeLayer = doc.layers[doc.layers.length - 1];
        }

        const filterRadius = Math.max(1, Math.round(this.params.radius)); // Pour le passe-haut (High Pass)
        const blurAmount = Math.max(0.5, this.params.strength / 10); // Flou Gaussien (ex: 40/10 = 4px)

        // 1. Calque de Flou Gaussien (Couleurs / Basse fréquence)
        doc.activeLayer = target;
        await ps.action.batchPlay([
          {
            _obj: "duplicate",
            _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }],
            name: "Flou Gaussien (Couleurs)"
          }
        ], {});
        
        try {
          if (doc.activeLayer && group.psObject) {
            await ps.action.batchPlay([{
              _obj: "move",
              _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }],
              to: { _ref: "layer", _id: group.psObject.id },
              adjustment: false
            }], {});
          }
        } catch(e) {}

        if (blurAmount > 0) {
          await Bridge.applyGaussianBlur(blurAmount * 2); // Flou plus soutenu pour la couleur
        }

        // 2. Calque Passe-Haut (Textures / Haute fréquence)
        doc.activeLayer = target; // Re-sélectionner l'original
        await ps.action.batchPlay([
          {
            _obj: "duplicate",
            _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }],
            name: "Passe-Haut (Textures)"
          }
        ], {});
        
        try {
          if (doc.activeLayer && group.psObject) {
            await ps.action.batchPlay([{
              _obj: "move",
              _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }],
              to: { _ref: "layer", _id: group.psObject.id },
              adjustment: false
            }], {});
          }
        } catch(e) {}

        await Bridge.applyHighPass(filterRadius);
        await Bridge.setBlendMode("linearLight"); // Mode de fusion standard pour passe-haut

        // Masque de fusion
        await ps.action.batchPlay([{
          _obj: "make",
          new: { _class: "channel" },
          at: { _ref: "channel", _enum: "channel", _value: "mask" },
          using: { _enum: "userMaskEnabled", _value: "revealSelection" }
        }], {});

        // 3. Calque d'éclat (Luminosité/Contraste)
        await ps.action.batchPlay([{
           _obj: "make",
           _target: [{ _ref: "layer" }],
           using: {
              _obj: "adjustmentLayer",
              type: {
                 _obj: "brightnessEvent",
                 brightness: 12,
                 center: 0
              }
           }
        }], {});
        
        try {
          const lumLayer = doc.activeLayer;
          if (lumLayer) {
             lumLayer.name = "Éclat Peau (Luminosité)";
             if (group.psObject) {
               await ps.action.batchPlay([{
                 _obj: "move",
                 _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }],
                 to: { _ref: "layer", _id: group.psObject.id },
                 adjustment: false
               }], {});
             }
          }
        } catch(e) {}

        // Désélectionner à la fin
        await Bridge.deselectAll();
      });

      return { group };
    }
  }

  global.HealModule = HealModule;
})(window);
