# OpenMilDB

An open-source, machine-readable military reference and asset database designed as an unclassified alternative to legacy tactical simulation databases like DB3000[cite: 2, 5].

OpenMilDB provides structured, crowdsourced technical schema blueprints alongside decoupled geopolitical and operational data models to ensure broad developer interoperability without classification risks[cite: 2, 5].

---

## 🏛️ System Architecture

OpenMilDB splits tactical environments into three distinct, loosely-coupled operational layers[cite: 2]:

| Layer | Functional Scope | Primary Schema Standard | Data Source |
| :--- | :--- | :--- | :--- |
| **Geopolitical Layer**[cite: 2] | National statistics, rules of engagement, maritime territorial boundaries[cite: 2]. | **OpenFactBook Schema** (`factbook.json`) via ISO 3166-1 alpha-3 keys[cite: 2] | RAM-loaded local mirror of OpenFactBook JSON dumps[cite: 2] |
| **Operational Layer**[cite: 2] | Troop layouts, base locations, and hierarchical chain of command[cite: 2]. | **ORBAT Mapper Scenario Schema** (MIL-STD-2525D / APP-6D SIDC codes)[cite: 2] | Community Open-Data Contributions[cite: 2] |
| **Technical Layer**[cite: 1, 2] | Master specifications for platforms (Air, Surface, Subsurface, Land, Facility), sensors, and weapons[cite: 1, 4]. | **Custom OpenMilDB Schemas** (`platform.schema.json`, `weapon.schema.json`)[cite: 1, 2] | OSINT / LLM-Generated Structured JSON[cite: 1, 5] |

---

## 🚀 Key Features

* **Composition over Inheritance:** Hardware components (Sensors, Weapons) exist as independent JSON files and are dynamically attached to platforms via foreign key mappings (`sensor_mounts`, `weapon_stations`)[cite: 1, 4].
* **Built-In Classification & Provenance Tracking:** Every entry tracks security classification parameters alongside source citation metadata (`citation_url`, `source_type`, `last_verified_utc`).
* **Abstracted Technical Tiers:** Generates unclassified baseline metrics (e.g., Radar Cross Section mapped to scale `1-5`, Electronic Warfare mapped to scale `1-10`, and base $P_k$ probabilities) to avoid sensitive or restricted parameters[cite: 5].
* **Decoupled SCIF Integration:** The core engine is 100% unclassified OSINT[cite: 5]. Defense contractors or research entities can fork the repository and swap baseline coefficients with proprietary data inside private networks without exposing restricted data[cite: 5].

---

## 🛡️ Classification & Provenance Policy

1. **Strict OSINT Only:** All pull requests introducing or modifying platform parameters **must** include an unclassified, publicly accessible URL citation in the `provenance.sources` array[cite: 5].
2. **Rejection of Restricted Data:** Any pull request referencing ITAR-controlled, classified, or restricted documents will be closed and expunged immediately[cite: 5].

---

## 🛠️ Schema Validation Setup

Ensure all JSON records conform to the schema definitions before submitting a pull request:

```bash
# Install dependencies
pip install jsonschema

# Run validation across all database entries
python scripts/validate_schemas.py# OpenMilDB
Open Military Database

## 📄 License
Distributed under the Upstream Compatibility License V1.0. See LICENSE for details.
