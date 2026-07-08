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

        // 1. Dupliquer le calque ciblé
        await ps.action.batchPlay([
          {
            _obj: "duplicate",
            _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }],
            name: "Lissage Peau (Passe-haut)"
          }
        ], {});
        
        // Déplacer ce calque lissé dans le groupe
        try {
          const smoothLayer = doc.activeLayer;
          if (smoothLayer && group.psObject) {
            await ps.action.batchPlay([{
              _obj: "move",
              _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }],
              to: { _ref: "layer", _id: group.psObject.id },
              adjustment: false
            }], {});
          }
        } catch(e) {
          console.warn("Failed to move smooth layer to group", e);
        }

        // 2. Inversion (Mode Négatif)
        await Bridge.invertLayer();
        
        // 3. Mode de Fusion : Lumière Vive (Vivid Light)
        await Bridge.setBlendMode("vividLight");

        // 4. Passe-haut (High Pass)
        await Bridge.applyHighPass(filterRadius);

        // 5. Flou Gaussien
        if (blurAmount > 0) {
          await Bridge.applyGaussianBlur(blurAmount);
        }

        // 6. Ajouter un masque noir par défaut (qui cache le lissage)
        // S'il y a une sélection active (faite par l'utilisateur), le masque
        // gardera cette zone blanche automatiquement grâce au comportement natif de Photoshop !
        await ps.action.batchPlay([{
          _obj: "make",
          new: { _class: "channel" },
          at: { _ref: "channel", _enum: "channel", _value: "mask" },
          using: { _enum: "userMaskEnabled", _value: "revealSelection" }
        }], {});

        // 7. Créer un calque vide pour la retouche manuelle (Correcteur/Pièce) au-dessus
        await Bridge.createEmptyLayer("Retouche Finale (Correcteur)");
        try {
          const manualLayer = doc.activeLayer;
          if (manualLayer && group.psObject) {
            await ps.action.batchPlay([{
              _obj: "move",
              _target: [{ _ref: "layer", _enum: "ordinal", _value: "targetEnum" }],
              to: { _ref: "layer", _id: group.psObject.id },
              adjustment: false
            }], {});
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
