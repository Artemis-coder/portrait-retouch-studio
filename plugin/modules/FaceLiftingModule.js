(function (global) {
  class FaceLiftingModule extends global.BaseModule {
    constructor() {
      super("Lifting du Visage", {
        strength: 20,
        radius: 80,
        intensity: 70,
        opacity: 100
      });
    }

    getControls() {
      return [
        { key: "enabled", type: "checkbox", label: "Activé" },
        { key: "opacity", type: "range", label: "Opacité", min: 0, max: 100 },
        { key: "strength", type: "range", label: "Force du Lifting", min: 0, max: 100 },
        { key: "radius", type: "range", label: "Rayon", min: 0, max: 100 },
        { key: "intensity", type: "range", label: "Intensité", min: 0, max: 100 }
      ];
    }

    async apply(pipeline) {
      const target = await global.PhotoshopBridge.getActiveLayer();
      if (!target) {
        throw new Error("No active layer found.");
      }

      const faceRegions = await global.FaceDetectionService.detectFaces(target);
      if (!faceRegions || faceRegions.length === 0) {
        throw new Error("No face detected for lifting.");
      }

      const group = await pipeline.createModuleGroup(this.name, target);
      const mask = await pipeline.createMaskForGroup(group);

      for (const face of faceRegions) {
        await this.applyLiquifyLift(target, face, this.params);
      }

      await global.PhotoshopBridge.setGroupOpacity(group, this.params.opacity);
      await pipeline.addAdjustmentLayer(group, "Brightness/Contrast", {
        brightness: this.params.intensity / 10,
        contrast: this.params.intensity / 20
      });

      return { group, mask };
    }

    async applyLiquifyLift(layer, faceRegion, params) {
      const { x, y, width, height } = faceRegion.bounds;
      const centerX = x + width / 2;
      const centerY = y + height / 2;

      // Map points relative to the detected face region bounds
      const payload = {
        tool: "TwirlClockwise",
        brushSize: params.radius,
        pressure: params.strength / 100,
        brushDensity: 0.8,
        brushRate: 0.8,
        brushHardness: 0.5,
        points: [
          { x: centerX - width * 0.1, y: centerY - height * 0.05 },
          { x: centerX + width * 0.05, y: centerY - height * 0.08 }
        ]
      };

      await global.PhotoshopBridge.applyLiquify(layer, payload);
    }
  }

  global.FaceLiftingModule = FaceLiftingModule;
})(window);
