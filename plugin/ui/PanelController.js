(function (global) {
  class PanelController {
    constructor(plugin) {
      this.plugin = plugin;
      this.container = document.getElementById("moduleList");
      this.statusEl = document.getElementById("status");
    }

    renderModuleList(modules) {
      if (!this.container) {
        return;
      }

      this.container.innerHTML = "";

      modules.forEach((module) => {
        const card = document.createElement("div");
        card.className = "module-card";
        
        // Load accordion expansion state from temporary plugin session state if desired,
        // or start collapsed by default to keep the UI clean.
        card.classList.add("collapsed");

        const header = document.createElement("div");
        header.className = "module-header";

        const leftSection = document.createElement("div");
        leftSection.className = "module-header-left";
        
        // Accordion toggle button / chevron
        const chevron = document.createElement("span");
        chevron.className = "module-chevron";
        chevron.innerHTML = `
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        `;
        
        const title = document.createElement("div");
        title.className = "module-title";
        title.textContent = module.name;

        leftSection.appendChild(chevron);
        leftSection.appendChild(title);

        // Header click area to toggle expand/collapse
        leftSection.addEventListener("click", (e) => {
          e.stopPropagation();
          card.classList.toggle("collapsed");
        });

        // Enable/Disable switch/toggle
        const toggleWrapper = document.createElement("label");
        toggleWrapper.className = "switch-toggle";

        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.checked = module.isEnabled();
        
        const slider = document.createElement("span");
        slider.className = "switch-slider";

        toggle.addEventListener("change", () => {
          module.updateParams({ enabled: toggle.checked });
          this.plugin.saveSettings();
          if (toggle.checked) {
            card.classList.remove("module-disabled");
          } else {
            card.classList.add("module-disabled");
          }
        });

        if (!module.isEnabled()) {
          card.classList.add("module-disabled");
        }

        toggleWrapper.appendChild(toggle);
        toggleWrapper.appendChild(slider);

        header.appendChild(leftSection);
        header.appendChild(toggleWrapper);

        const controlsContainer = document.createElement("div");
        controlsContainer.className = "controls-container";

        const controls = document.createElement("div");
        controls.className = "controls";

        // Generate controls via ModuleControlFactory
        module.getControls().forEach((control) => {
          if (control.key === "enabled") return; // We already have a header toggle for 'enabled'
          
          const controlEl = global.ModuleControlFactory.createControl(module, control, (updatedParams) => {
            module.updateParams(updatedParams);
            this.plugin.saveSettings();

            // Real-time opacity update in Photoshop if group is already created
            if (control.key === "opacity" && this.plugin.pipeline) {
              global.PhotoshopBridge.executeAsModal(async () => {
                await global.PhotoshopBridge.setGroupOpacity({ name: module.name }, Number(updatedParams.opacity));
              }).catch(() => {});
            }
          });
          
          controls.appendChild(controlEl);
        });

        controlsContainer.appendChild(controls);
        card.appendChild(header);
        card.appendChild(controlsContainer);
        this.container.appendChild(card);
      });
    }

    setStatus(message, isError = false) {
      if (!this.statusEl) return;
      this.statusEl.textContent = message;
      if (isError) {
        this.statusEl.className = "status error";
      } else {
        this.statusEl.className = "status success";
      }
    }
  }

  global.PanelController = PanelController;
})(window);
