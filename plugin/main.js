(function (global) {
  class PortraitRetouchPlugin {
    constructor() {
      this.modules = [];
      this.pipeline = null;
      this.settingsStore = new global.SettingsStore("portrait-retouch-plugin");
      this.ui = new global.PanelController(this);
      this.init();
    }

    async init() {
      this.pipeline = typeof global.LayerPipeline === "function" ? new global.LayerPipeline() : {};
      await this.loadModules();
      this.loadSettings();
      this.renderUI();
      this.bindEvents();
    }

    async loadModules() {
      const moduleClasses = [
        global.HealModule,
        global.DodgeBurnModule,
        global.PortraitVolumesModule,
        global.MatifierModule,
        global.SkinToneModule,
        global.SkinMaskModule,
        global.EyeBundleModule,
        global.WhiteTeethModule,
        global.FabricModule,
        global.CleanBackdropModule,
        global.StrayHairsModule,
        global.GlassesEyeRemovalModule,
        global.FaceLiftingModule
      ];

      this.modules = moduleClasses
        .filter(Boolean)
        .map((ModuleClass) => new ModuleClass());
    }

    loadSettings() {
      const defaults = {};
      this.modules.forEach((module) => {
        defaults[module.name] = module.params;
      });

      const stored = this.settingsStore.load(defaults);
      this.modules.forEach((module) => {
        const saved = stored[module.name];
        if (saved) {
          module.updateParams(saved);
        }
      });
    }

    saveSettings() {
      const payload = {};
      this.modules.forEach((module) => {
        payload[module.name] = module.params;
      });
      this.settingsStore.save(payload);
    }

    renderUI() {
      this.ui.renderModuleList(this.modules);
    }

    bindEvents() {
      const applyBtn = document.getElementById("applyBtn");
      const resetBtn = document.getElementById("resetBtn");
      const previewBtn = document.getElementById("previewBtn");

      applyBtn?.addEventListener("click", () => this.applyPipeline());
      resetBtn?.addEventListener("click", () => this.resetPipeline());
      previewBtn?.addEventListener("click", () => this.previewPipeline());
    }

    async applyPipeline() {
      const enabledModules = this.modules.filter((module) => module.isEnabled());
      this.ui.setStatus("Applying pipeline...");

      try {
        await global.PhotoshopBridge.executeAsModal(async () => {
          for (const module of enabledModules) {
            await module.apply(this.pipeline);
          }
        });
        this.saveSettings();
        this.ui.setStatus("Pipeline applied successfully.");
      } catch (error) {
        console.error(error);
        this.ui.setStatus(`Error: ${error.message}`);
      }
    }

    async resetPipeline() {
      this.modules.forEach((module) => module.reset());
      this.renderUI();
      this.saveSettings();
      this.ui.setStatus("Resetting document groups...");
      
      try {
        await global.PhotoshopBridge.executeAsModal(async () => {
          if (this.pipeline && typeof this.pipeline.resetDocument === "function") {
            await this.pipeline.resetDocument();
          }
        });
        this.ui.setStatus("Pipeline reset and layer groups removed.");
      } catch (error) {
        console.error(error);
        this.ui.setStatus(`Reset error: ${error.message}`);
      }
    }

    previewPipeline() {
      this.ui.setStatus("Preview mode is ready for the selected modules.");
    }
  }

  global.PortraitRetouchPlugin = PortraitRetouchPlugin;
  global.portraitRetouchPlugin = new PortraitRetouchPlugin();
})(window);
