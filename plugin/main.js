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
      const toggleExpandBtn = document.getElementById("toggleExpandBtn");
      const toggleEnableBtn = document.getElementById("toggleEnableBtn");
      const closePluginBtn = document.getElementById("closePluginBtn");

      applyBtn?.addEventListener("click", () => this.applyPipeline());
      resetBtn?.addEventListener("click", () => this.resetPipeline());
      previewBtn?.addEventListener("click", () => this.previewPipeline());
      
      let allExpanded = false;
      toggleExpandBtn?.addEventListener("click", () => {
        allExpanded = !allExpanded;
        const cards = this.ui.container.querySelectorAll(".module-card");
        cards.forEach(card => {
          if (allExpanded) {
            card.classList.remove("collapsed");
          } else {
            card.classList.add("collapsed");
          }
        });
        toggleExpandBtn.textContent = allExpanded ? "Tout Replier" : "Tout Déplier";
      });

      let allEnabled = true;
      toggleEnableBtn?.addEventListener("click", () => {
        allEnabled = !allEnabled;
        this.modules.forEach(module => module.updateParams({ enabled: allEnabled }));
        this.saveSettings();
        this.renderUI();
        toggleEnableBtn.textContent = allEnabled ? "Tout Désactiver" : "Tout Activer";
      });
      
      closePluginBtn?.addEventListener("click", () => {
        this.ui.setStatus("Fermeture gérée par l'hôte UXP.");
      });
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
        this.isPreviewing = false; // Reset preview state
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

    async previewPipeline() {
      if (typeof this.isPreviewing === 'undefined') {
        this.isPreviewing = false;
      }
      this.isPreviewing = !this.isPreviewing;
      
      try {
        await global.PhotoshopBridge.executeAsModal(async () => {
          const ps = global.PhotoshopBridge.getPhotoshopModule();
          if (!ps) return;
          const doc = ps.app.activeDocument;
          if (!doc) return;
          
          const moduleNames = this.modules.map(m => m.name);
          
          doc.layers.forEach(layer => {
            if (moduleNames.includes(layer.name)) {
              layer.visible = !this.isPreviewing;
            }
          });
        });
        
        if (this.isPreviewing) {
          this.ui.setStatus("Aperçu : Avant (Effets masqués)", false);
          document.getElementById("previewBtn").textContent = "Afficher les effets";
        } else {
          this.ui.setStatus("Aperçu : Après (Effets visibles)", false);
          document.getElementById("previewBtn").textContent = "Aperçu (Avant)";
        }
      } catch (e) {
        this.ui.setStatus("Erreur lors de l'aperçu", true);
        console.error(e);
      }
    }
  }

  global.PortraitRetouchPlugin = PortraitRetouchPlugin;
  global.portraitRetouchPlugin = new PortraitRetouchPlugin();
})(window);
