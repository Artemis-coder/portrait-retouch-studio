(function (global) {
  class ModuleControlFactory {
    static createControl(module, control, onUpdate) {
      const row = document.createElement("div");
      row.className = `control-row control-${control.type}`;

      const labelWrapper = document.createElement("div");
      labelWrapper.className = "control-label-wrapper";

      const label = document.createElement("label");
      label.textContent = control.label;
      labelWrapper.appendChild(label);

      let input;

      if (control.type === "checkbox") {
        input = document.createElement("input");
        input.type = "checkbox";
        input.className = "control-checkbox";
        input.checked = module.params[control.key];

        input.addEventListener("change", () => {
          onUpdate({ [control.key]: input.checked });
        });
        
        row.appendChild(input);
        row.appendChild(label);
      } else if (control.type === "range") {
        const valIndicator = document.createElement("span");
        valIndicator.className = "control-value";
        valIndicator.textContent = module.params[control.key];
        labelWrapper.appendChild(valIndicator);

        input = document.createElement("input");
        input.type = "range";
        input.className = "control-range";
        input.min = control.min ?? 0;
        input.max = control.max ?? 100;
        input.value = module.params[control.key];

        input.addEventListener("input", () => {
          valIndicator.textContent = input.value;
          onUpdate({ [control.key]: Number(input.value) });
        });

        row.appendChild(labelWrapper);
        row.appendChild(input);
      }

      return row;
    }
  }

  global.ModuleControlFactory = ModuleControlFactory;
})(window);
