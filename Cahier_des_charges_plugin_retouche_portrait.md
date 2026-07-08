# Cahier des Charges – Plugin Adobe Photoshop UXP de retouche portrait professionnel

## 1. Objectif du projet

Créer un plugin Adobe Photoshop compatible UXP permettant d’exécuter un pipeline de retouche portrait haut de gamme, non destructif, basé sur des calques et des masques modifiables. Le plugin doit permettre à un photographe ou à un retoucheur d’appliquer un ensemble de traitements de portrait de manière modulable, contrôlable et réversible.

Le plugin doit offrir un panneau d’interface moderne, inspiré des standards Adobe Spectrum Web Components, avec une logique orientée objet et une exécution stable via executeAsModal.

---

## 2. Contexte et usage

Le plugin est destiné à des professionnels de la retouche photo qui souhaitent :

- appliquer des corrections locales et globales sur portrait sans modifier l’image source ;
- garder un workflow modulaire avec contrôle fin de chaque étape ;
- ajuster chaque traitement individuellement via une interface claire ;
- utiliser des opérations intelligentes de détection faciale et de lifting ciblé.

---

## 3. Objectifs fonctionnels

Le plugin doit permettre de traiter les modules suivants :

1. Heal
2. Dodge & Burn
3. Portrait Volumes
4. Matifier
5. Skin Tone
6. Skin Mask
7. Eye Bundle
8. White Teeth
9. Fabric
10. Clean Backdrop
11. Stray Hairs
12. Glasses Eye Removal
13. Face Make Lifting

Chaque module doit générer un groupe de calques spécifique, avec un masque modifiable. L’utilisateur doit pouvoir :

- activer ou désactiver un module ;
- ajuster son opacité ;
- régler des paramètres de force, rayon et intensité ;
- prévisualiser l’effet avant application.

---

## 4. Contraintes techniques

### 4.1 Plateforme

- Développement en UXP (Unified Extensibility Platform).
- Interface UI basée sur Adobe Spectrum Web Components.
- Utilisation de l’API Photoshop via UXP et, si nécessaire, de la logique d’actions Photoshop.

### 4.2 Architecture

- Architecture orientée objet (class-based).
- Code modulaire, maintenable et extensible.
- Utilisation de executeAsModal pour garantir une exécution stable et sécurisée.

### 4.3 Workflow

- Le plugin doit travailler de façon non destructrice.
- Chaque module doit créer un groupe de calques dédié.
- Chaque groupe doit contenir :
  - un calque d’effet ou de correction ;
  - un masque de fusion modifiable ;
  - si nécessaire, un calque de réglage ou une sélection de masque.

---

## 5. Exigences fonctionnelles détaillées

### FR1 – Interface utilisateur

L’interface doit comporter :

- un panneau latéral ou principal avec une liste de modules ;
- un contrôleur par module avec sliders, checkboxes et boutons d’action ;
- un bouton “Apply” pour exécuter le pipeline ;
- un bouton “Reset” pour supprimer les groupes générés ;
- un bouton “Preview” ou “Test” pour simuler le traitement sur un aperçu.

### FR2 – Gestion modulaire

Chaque module doit être indépendant et configurable. Un module doit :

- exposer une structure de paramètres définie ;
- posséder une méthode d’exécution spécifique ;
- être ajouté ou retiré facilement sans casser le pipeline global.

### FR3 – Non destructivité

Le plugin ne doit jamais modifier directement la couche source finale sans création d’un groupe de calques associé. Les traitements doivent être enregistrés dans des calques séparés et être ajustables ultérieurement.

### FR4 – Contrôles de module

Pour chaque module, l’interface doit proposer au minimum :

- un checkbox “Enabled” ;
- un slider “Opacity” ;
- un slider “Strength” ;
- un slider “Radius” ;
- un slider “Intensity” ;
- des checkboxes spécifiques si nécessaire.

### FR5 – Détection intelligente du visage

Le plugin doit intégrer des mécanismes de détection automatique du visage pour :

- identifier les zones de visage ;
- traiter plusieurs visages dans une même image ;
- appliquer un traitement différencié selon le genre si disponible ;
- utiliser un moteur d’édition de forme, par exemple Liquify, pour un lifting intelligent.

### FR6 – Pipeline de traitement

Le pipeline doit permettre :

- l’application séquentielle des modules ;
- l’activation/désactivation de modules indépendamment ;
- la sauvegarde des paramètres par module ;
- la possibilité de relancer l’exécution sur un groupe existant.

### FR7 – Stabilité d’exécution

L’exécution des traitements doit se faire via executeAsModal afin de réduire les risques d’erreurs, de crash et d’incohérences de l’API Photoshop.

---

## 6. Modules attendus

### 6.1 Heal

Objectif : corriger les imperfections locales et les défauts de peau.

Paramètres suggérés :
- Strength
- Radius
- Opacity
- Source refinement

### 6.2 Dodge & Burn

Objectif : renforcer les lumières et les ombres pour sculpter les volumes du visage.

Paramètres suggérés :
- Exposure
- Radius
- Density
- Opacity

### 6.3 Portrait Volumes

Objectif : améliorer la structure du visage par des effets de volume subtils.

Paramètres suggérés :
- Intensity
- Radius
- Mask softness

### 6.4 Matifier

Objectif : réduire les reflets, le grain de peau ou l’aspect brillant.

Paramètres suggérés :
- Intensity
- Blur amount
- Threshold

### 6.5 Skin Tone

Objectif : équilibrer la couleur et la uniformité de la peau.

Paramètres suggérés :
- Temperature
- Saturation
- Hue shift
- Strength

### 6.6 Skin Mask

Objectif : isoler la peau pour limiter les corrections à la zone concernée.

Paramètres suggérés :
- Feather
- Smoothness
- Range

### 6.7 Eye Bundle

Objectif : améliorer les yeux et leur environnement.

Paramètres suggérés :
- Brightness
- Contrast
- Sharpening
- Opacity

### 6.8 White Teeth

Objectif : rendre les dents plus blanches de façon naturelle.

Paramètres suggérés :
- Whitening amount
- Saturation control
- Feather

### 6.9 Fabric

Objectif : améliorer les vêtements, tissus ou textures de fond.

Paramètres suggérés :
- Texture strength
- Sharpness
- Saturation

### 6.10 Clean Backdrop

Objectif : nettoyer le fond et améliorer la séparation du sujet.

Paramètres suggérés :
- Blur
- Contrast
- Edge cleanup

### 6.11 Stray Hairs

Objectif : retirer ou atténuer les cheveux errants autour du visage.

Paramètres suggérés :
- Radius
- Hardness
- Opacity

### 6.12 Glasses Eye Removal

Objectif : supprimer ou atténuer la présence de verres ou reflets sur les yeux.

Paramètres suggérés :
- Strength
- Feather
- Blend mode

### 6.13 Face Make Lifting

Objectif : appliquer un lifting intelligent du visage via Liquify ou correction locale.

Paramètres suggérés :
- Amount
- Radius
- Mask intensity
- Face region targeting

---

## 7. Structure de l’architecture logicielle

### 7.1 Structure des dossiers

```text
plugin/
  manifest.json
  index.html
  styles.css
  main.js
  modules/
    BaseModule.js
    HealModule.js
    DodgeBurnModule.js
    PortraitVolumesModule.js
    MatifierModule.js
    SkinToneModule.js
    SkinMaskModule.js
    EyeBundleModule.js
    WhiteTeethModule.js
    FabricModule.js
    CleanBackdropModule.js
    StrayHairsModule.js
    GlassesEyeRemovalModule.js
    FaceLiftingModule.js
  ui/
    PanelController.js
    ModuleControlFactory.js
  utils/
    PhotoshopBridge.js
    FaceDetection.js
    LayerUtils.js
    SettingsStore.js
```

### 7.2 Classes principales

#### Classe principale : PluginController
Responsable de :
- initialiser l’interface ;
- charger les paramètres ;
- déclencher le pipeline ;
- gérer les actions utilisateur.

#### Classe : ModuleRegistry
Responsable de :
- enregistrer tous les modules ;
- fournir la liste des modules actifs ;
- permettre l’extension future du plugin.

#### Classe abstraite : BaseModule
Responsable de :
- définir l’API commune des modules ;
- exposer enable/disable, apply, reset, buildControls.

#### Classe : LayerPipeline
Responsable de :
- créer les groupes de calques ;
- gérer les masques ;
- appliquer les modules dans l’ordre défini.

#### Classe : PhotoshopBridge
Responsable de :
- encapsuler les appels Photoshop ;
- centraliser les interactions avec les calques, sélections et masques.

#### Classe : FaceDetectionService
Responsable de :
- détecter les visages ;
- gérer les zones d’application ;
- fournir des informations de ciblage.

---

## 8. Spécification de l’interface utilisateur

### 8.1 Structure du panneau

Le panneau doit contenir :

- un header avec le nom du plugin ;
- une section “Portrait Processing” ;
- une liste de modules sous forme de cartes ou d’accordéons ;
- une zone de résumé des calques générés ;
- un footer avec boutons d’action.

### 8.2 Composants Spectrum Web Components recommandés

- sp-panel
- sp-detail
- sp-slider
- sp-checkbox
- sp-button
- sp-textfield
- sp-picker
- sp-divider

### 8.3 Exemples de comportements UI

- Chaque module peut être plié/déplié.
- L’activation du module ajoute automatiquement ses contrôles.
- Le slider d’opacité doit ajuster la transparence du groupe de calques.
- Les changements doivent être persistés localement entre les sessions.

---

## 9. Structure du manifest.json

```json
{
  "id": "com.example.portrait-retouch-plugin",
  "name": "Portrait Retouch Studio",
  "version": "1.0.0",
  "host": {
    "app": "PS",
    "minVersion": "24.0"
  },
  "ui": {
    "type": "Panel",
    "panel": {
      "label": "Portrait Retouch Studio",
      "width": 360,
      "height": 700
    }
  },
  "main": "index.html",
  "assets": {
    "styles": [
      "styles.css"
    ]
  },
  "requiredPermissions": {
    "allowCodeGeneration": true,
    "allowFileAccess": true
  }
}
```

---

## 10. Squelette HTML/CSS avec Spectrum Web Components

### 10.1 index.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Portrait Retouch Studio</title>
    <script src="https://cdn.jsdelivr.net/npm/@spectrum-web-components/theme@0.15.0/src/theme.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@spectrum-web-components/button@0.15.0/src/button.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@spectrum-web-components/slider@0.15.0/src/slider.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@spectrum-web-components/checkbox@0.15.0/src/checkbox.js"></script>
    <script type="module" src="https://cdn.jsdelivr.net/npm/@spectrum-web-components/picker@0.15.0/src/picker.js"></script>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <sp-theme color="light" scale="medium">
      <div class="panel">
        <h2>Portrait Retouch Studio</h2>

        <sp-detail>
          <div slot="summary">Modules</div>
          <div id="moduleList"></div>
        </sp-detail>

        <div class="actions">
          <sp-button id="previewBtn">Preview</sp-button>
          <sp-button id="applyBtn" variant="primary">Apply</sp-button>
          <sp-button id="resetBtn">Reset</sp-button>
        </div>
      </div>
    </sp-theme>

    <script src="main.js"></script>
  </body>
</html>
```

### 10.2 styles.css

```css
body {
  margin: 0;
  padding: 12px;
  font-family: Arial, sans-serif;
  background: #f5f5f5;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.module-card {
  border: 1px solid #d0d0d0;
  border-radius: 8px;
  padding: 10px;
  background: white;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}
```

---

## 11. Squelette de la classe JavaScript principale

```js
class PortraitRetouchPlugin {
  constructor() {
    this.modules = [];
    this.pipeline = null;
    this.settings = {};
    this.init();
  }

  async init() {
    this.pipeline = new LayerPipeline();
    this.moduleRegistry = new ModuleRegistry();
    this.ui = new PanelController(this);
    await this.loadModules();
    this.renderUI();
  }

  async loadModules() {
    const moduleClasses = [
      HealModule,
      DodgeBurnModule,
      PortraitVolumesModule,
      MatifierModule,
      SkinToneModule,
      SkinMaskModule,
      EyeBundleModule,
      WhiteTeethModule,
      FabricModule,
      CleanBackdropModule,
      StrayHairsModule,
      GlassesEyeRemovalModule,
      FaceLiftingModule
    ];

    this.modules = moduleClasses.map((ModuleClass) => new ModuleClass());
    this.moduleRegistry.register(this.modules);
  }

  renderUI() {
    this.ui.renderModuleList(this.modules);
  }

  async applyPipeline() {
    const enabledModules = this.modules.filter((module) => module.isEnabled());

    await require("photoshop").core.executeAsModal(async () => {
      for (const module of enabledModules) {
        await module.apply(this.pipeline);
      }
    });
  }

  resetPipeline() {
    this.pipeline.reset();
  }
}

const plugin = new PortraitRetouchPlugin();
```

---

## 12. Exemple de fonction robuste pour Face Make Lifting via Liquify

```js
class FaceLiftingModule extends BaseModule {
  constructor() {
    super("Face Make Lifting");
    this.params = {
      enabled: true,
      opacity: 100,
      strength: 20,
      radius: 80,
      maskIntensity: 0.7
    };
  }

  async apply(pipeline) {
    const target = await PhotoshopBridge.getActiveLayer();
    if (!target) {
      throw new Error("No active layer found.");
    }

    const faceRegions = await FaceDetectionService.detectFaces(target);
    if (!faceRegions.length) {
      throw new Error("No face detected.");
    }

    const group = await pipeline.createModuleGroup(this.name, target);
    const mask = await pipeline.createMaskForGroup(group);

    await PhotoshopBridge.runModal(async () => {
      for (const face of faceRegions) {
        await this.applyLiquifyLift(target, face, this.params);
      }

      await PhotoshopBridge.createAdjustmentLayer(group, "Brightness/Contrast", {
        brightness: 5,
        contrast: 5
      });

      await PhotoshopBridge.setGroupOpacity(group, this.params.opacity);
      await PhotoshopBridge.linkMaskToGroup(group, mask);
    });
  }

  async applyLiquifyLift(layer, faceRegion, params) {
    const { x, y, width, height } = faceRegion.bounds;
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    const liquifyData = {
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

    await PhotoshopBridge.applyLiquify(layer, liquifyData);
    await PhotoshopBridge.softMaskRegion(layer, faceRegion, params.maskIntensity);
  }
}
```

> Cette structure sert de base robuste. Elle doit être enrichie avec des contrôles d’UI, des validations d’entrée, des garde-fous et des mécanismes de rollback selon les besoins du workflow attendu.

---

## 13. Exigences non fonctionnelles

### 13.1 Performance

- Le plugin doit rester réactif même sur des images de grande taille.
- Les traitements doivent être optimisés pour limiter les temps d’exécution.

### 13.2 Fiabilité

- Les opérations doivent être rollback-safe si une étape échoue.
- Les erreurs doivent être affichées clairement dans l’interface.

### 13.3 Maintenabilité

- Le code doit être documenté.
- Chaque module doit être autonome et facilement extensible.

### 13.4 Accessibilité

- Les contrôles doivent être lisibles et utilisables avec clavier.
- Les contrastes et tailles d’éléments doivent respecter les standards UI.

---

## 14. Critères d’acceptation

Le projet sera considéré comme réussi si :

- le plugin se charge dans Photoshop via UXP ;
- l’interface affiche les modules et leurs contrôles ;
- chaque module crée un groupe de calques et un masque modifiable ;
- les modules peuvent être activés/désactivés individuellement ;
- l’application du pipeline fonctionne de façon stable via executeAsModal ;
- un lifting intelligent peut être appliqué sur un visage détecté ;
- l’utilisateur peut ajuster les paramètres après exécution.

---

## 15. Livrables attendus

1. Manifest UXP complet.
2. Interface HTML/CSS basée sur Spectrum Web Components.
3. Structure JavaScript orientée objet du plugin.
4. Implémentation de base des 13 modules.
5. Système de pipeline non destructif avec groupes de calques.
6. Fonction exemple de Face Make Lifting via Liquify.
7. Documentation technique interne et commentaires explicatifs.

---

## 16. Proposition de prompt final à transmettre à une IA de génération de code

> Agis en tant qu’Expert Senior en développement de plugins Adobe Photoshop UXP. Développe un plugin de retouche portrait professionnel haut de gamme, non destructif, basé sur des calques et des masques modifiables. Le plugin doit inclure 13 modules : Heal, Dodge & Burn, Portrait Volumes, Matifier, Skin Tone, Skin Mask, Eye Bundle, White Teeth, Fabric, Clean Backdrop, Stray Hairs, Glasses Eye Removal et Face Make Lifting. L’architecture doit être orientée objet, modulaire et extensible. L’interface doit utiliser Adobe Spectrum Web Components. Chaque module doit générer un groupe de calques dédié avec des masques modifiables. L’utilisateur doit pouvoir activer/désactiver chaque module et ajuster l’opacité, la force, le rayon et l’intensité via des sliders. Le plugin doit intégrer des fonctionnalités de détection de visage, de traitement multi-visages et de lifting intelligent via Liquify. Le code doit utiliser executeAsModal pour une exécution stable. Génère la structure du manifest.json, l’interface HTML/CSS, la classe principale JavaScript et un exemple robuste d’implémentation du module Face Make Lifting avec commentaires explicatifs pour chaque étape.

---

## 17. Prompt ultra-optimisé pour une génération de code de qualité professionnelle

> Agis en tant qu’architecte logiciel senior spécialisé dans Adobe Photoshop UXP. Ta mission est de générer un plugin professionnel, propre, maintenable et prêt à être étendu. Produis un projet complet et cohérent pour un plugin de retouche portrait non destructif.
>
> Contraintes obligatoires :
> - Utilise UXP et Adobe Spectrum Web Components.
> - Structure le code en modules JavaScript orientés objet.
> - Chaque module doit être une classe indépendante héritant d’une base commune.
> - Implémente un pipeline de traitement centralisé avec exécution via executeAsModal.
> - Chaque traitement doit créer un groupe de calques dédié avec masque modifiable.
> - Chaque module doit exposer des contrôles UI dynamiques : enabled, opacity, strength, radius, intensity.
> - Ajoute des mécanismes de détection de visage et de ciblage par zone.
> - Intègre un module Face Make Lifting basé sur Liquify avec une logique robuste.
> - Rends le code commenté, documenté, extensible et sécurisé.
>
> Livrables attendus :
> 1. manifest.json complet.
> 2. index.html avec structure UI et composants Spectrum.
> 3. styles.css propre et responsive.
> 4. main.js avec initialisation du plugin.
> 5. modules/BaseModule.js et tous les modules implémentés sous forme de classes.
> 6. utils/PhotoshopBridge.js, LayerUtils.js, FaceDetection.js et SettingsStore.js.
> 7. UI/PanelController.js et ModuleControlFactory.js.
>
> Règles de qualité :
> - Évite les solutions bricolées.
> - Priorise la modularité et la séparation des responsabilités.
> - Gère les erreurs proprement avec des messages explicites.
> - Prévois un mécanisme de reset et de rollback.
> - Respecte les bonnes pratiques UXP et Adobe Photoshop.
>
> Commence par la structure du projet, puis génère les classes principales, puis les modules, puis l’interface.

---

## 18. Plan de livraison recommandé

### Phase 1 — Structure de base
- créer les fichiers manifest, HTML, CSS et JS principaux ;
- définir l’architecture des classes et le registre des modules.

### Phase 2 — Interface utilisateur
- implémenter les composants Spectrum ;
- créer les contrôles par module ;
- connecter l’UI aux paramètres du plugin.

### Phase 3 — Pipeline de traitement
- intégrer la logique de création de groupes, de calques et de masques ;
- exécuter les modules via executeAsModal.

### Phase 4 — Modules métier
- implémenter les modules de retouche portrait ;
- ajouter la logique de détection faciale ;
- intégrer le lifting intelligent avec Liquify.

### Phase 5 — Validation
- tester le chargement dans Photoshop ;
- vérifier la stabilité des opérations ;
- ajuster les performances et la robustesse.
