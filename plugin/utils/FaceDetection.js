(function (global) {
  class FaceDetectionService {
    /**
     * Detects face regions in the target layer/document.
     * In a real Photoshop UXP context, it can use the selection size or full canvas size
     * to determine the relative bounds.
     * Outside Photoshop, it returns standard coordinates for simulation.
     */
    static async detectFaces(targetLayer) {
      const activeDoc = await global.PhotoshopBridge.getActiveDocument();
      
      // Default dimensions (fallback)
      let docWidth = 1920;
      let docHeight = 1080;

      if (activeDoc) {
        // Photoshop DOM returns width/height with unit or as objects.
        // In UXP, doc.width/doc.height can be integers (pixels) or have units.
        docWidth = typeof activeDoc.width === 'number' ? activeDoc.width : parseFloat(activeDoc.width) || 1920;
        docHeight = typeof activeDoc.height === 'number' ? activeDoc.height : parseFloat(activeDoc.height) || 1080;
      }

      // Simulate face detection:
      // Return 1 face centered in the top-middle third of the portrait canvas
      const faceWidth = docWidth * 0.35;
      const faceHeight = docHeight * 0.45;
      const faceX = (docWidth - faceWidth) / 2;
      const faceY = docHeight * 0.15; // Centered vertically in the upper half

      return [
        {
          id: 1,
          gender: "unknown",
          bounds: {
            x: Math.round(faceX),
            y: Math.round(faceY),
            width: Math.round(faceWidth),
            height: Math.round(faceHeight)
          }
        }
      ];
    }
  }

  global.FaceDetectionService = FaceDetectionService;
})(window);
