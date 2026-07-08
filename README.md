# Portrait Retouch Studio — Plugin Adobe Photoshop UXP

Un plugin professionnel de retouche portrait non destructif pour Adobe Photoshop, développé en UXP (Unified Extensibility Platform).

## ✨ Fonctionnalités

- **13 modules de retouche** indépendants et configurables
- **Pipeline non destructif** basé sur des groupes de calques et des masques modifiables
- **Détection de visage** automatique pour le module Face Make Lifting (Liquify)
- **Interface dark premium** avec accordéons, sliders temps réel et toggles ON/OFF
- **Persistance des paramètres** entre les sessions via localStorage
- **Architecture orientée objet** — maintenable et extensible

## 🧩 Modules inclus

| # | Module | Rôle |
|---|---|---|
| 1 | **Heal** | Corrections locales (Courbes + masque) |
| 2 | **Dodge & Burn** | Sculpter lumières/ombres (2× Courbes) |
| 3 | **Portrait Volumes** | Renforcement des volumes du visage |
| 4 | **Matifier** | Réduction des brillances de peau |
| 5 | **Skin Tone** | Équilibre des teintes de peau (Teinte/Sat) |
| 6 | **Skin Mask** | Isolation de la peau (masque noir) |
| 7 | **Eye Bundle** | Sublimer les yeux (Brightness + Curves) |
| 8 | **White Teeth** | Blanchissement naturel des dents |
| 9 | **Fabric** | Amélioration des textures de vêtements |
| 10 | **Clean Backdrop** | Nettoyage du fond |
| 11 | **Stray Hairs** | Suppression des cheveux rebelles |
| 12 | **Glasses Eye Removal** | Correction des reflets de lunettes |
| 13 | **Face Make Lifting** | Lifting Liquify via détection faciale |

## 🏗️ Architecture

```
plugin/
├── manifest.json               ← Manifest UXP v5
├── index.html                  ← Interface HTML
├── styles.css                  ← Thème dark premium
├── main.js                     ← Contrôleur principal
├── modules/                    ← 13 modules + BaseModule
├── ui/
│   ├── PanelController.js      ← Accordéons, toggles, UI réactive
│   └── ModuleControlFactory.js ← Fabrique de contrôles
└── utils/
    ├── PhotoshopBridge.js      ← API Photoshop UXP + mock fallback
    ├── LayerUtils.js           ← Pipeline de calques avec suivi
    ├── FaceDetection.js        ← Détection de visage
    └── SettingsStore.js        ← Persistance localStorage
```

## 🚀 Installation dans Photoshop

1. Télécharger **[Adobe UXP Developer Tool](https://developer.adobe.com/photoshop/uxp/devtool/)**
2. Ouvrir UXP Developer Tool → **Add Plugin**
3. Pointer vers `plugin/manifest.json`
4. Cliquer **Load** → le panneau apparaît sous **Plugins > Portrait Retouch Studio**

## 🌐 Aperçu local (navigateur)

```bash
cd plugin
python3 -m http.server 8080
# Ouvrir http://localhost:8080
```

## ⚙️ Compatibilité

- **Photoshop** : version 24.0+
- **UXP** : Manifest v5
- **Plateforme** : macOS / Windows

## 📋 Prérequis

- Adobe Photoshop CC 24.0 ou supérieur
- Adobe UXP Developer Tool
- Un document portrait ouvert dans Photoshop

## 📁 Ajouter les icônes

Placer dans `plugin/icons/` :
- `panel-icon-dark.png` (23×23 px) — pour les thèmes sombres Adobe
- `panel-icon-light.png` (23×23 px) — pour les thèmes clairs Adobe
- (optionnel) versions 46×46 pour Retina

## 📄 Licence

MIT — libre d'utilisation, modification et distribution.
