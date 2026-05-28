# Veterinaria Hexagonal - MVP v1.1

## 1. Justificación de la Arquitectura
El proyecto implementa una **Arquitectura Hexagonal** pura, donde el dominio (`domain/`) se encuentra estrictamente aislado de la infraestructura (`infrastructure/`). 
* La integridad arquitectónica se verifica mediante el análisis estático, comprobando que el dominio no posee dependencias inversas hacia capas externas.

## 2. Integración Continua (Pipeline CI/CD)
El flujo automatizado en `.github/workflows/test.yml` garantiza la calidad mediante 6 stages optimizados (de rápido a lento):
1. **Lint:** Análisis de estilo y sintaxis estática.
2. **Build:** Compilación e instalación de dependencias.
3. **Unit Test:** Ejecución de pruebas unitarias aisladas del dominio.
4. **Integration Test:** Ejecución de flujos lógicos con infraestructura.
5. **Coverage Gate:** Validación de cobertura (mínimo 80% en módulos de dominio).
6. **Mutation Testing:** Evaluación cualitativa con Infection PHP.
   * **Justificación del Umbral:** Se ha configurado un umbral de mutación (`--min-msi=70`). Basado en los hallazgos de la S07, este umbral representa el equilibrio óptimo entre el rigor analítico de los asserts y el costo computacional en el runner de integración continua.

## 3. Instrucciones de Ejecución
* **Instalación Inicial:** Ejecutar `composer install`
* **Validación Local Completa:** Ejecutar `composer test` (Este alias ejecuta la suite unificada: PHPUnit, Behat e Infection).
* **CI/CD:** Cada evento `push` o `pull request` dispara automáticamente el pipeline en GitHub Actions.

---

## 4. Vinculación Arquitectónica (SWEBOK) - Laboratorio 6
Los escenarios de prueba utilizan técnicas de **caja negra** (BDD) para validar requisitos sin dependencia de la implementación interna.

| Nombre del Escenario | Puerto Primario Invocado | Técnica SWEBOK |
|----------------------|--------------------------|----------------|
| Crear una cita exitosamente | `GestionCitas::crear()` | Caja Negra |
| Intentar crear cita sin nombre de mascota | `GestionCitas::crear()` | Caja Negra |
| Confirmar una cita existente | `GestionCitas::confirmar()` | Caja Negra |
| Intentar confirmar una cita que ya fue cancelada | `GestionCitas::confirmar()` | Caja Negra |
| Cancelar una cita pendiente | `GestionCitas::cancelar()` | Caja Negra |
| Listar todas las citas de un cliente | `GestionCitas::listar()` | Caja Negra |
| Confirmar una cita pendiente exitosamente | `GestionCitas::confirmar()` | Caja Negra |
| Intentar confirmar una cita que no existe | `GestionCitas::confirmar()` | Caja Negra |
| Intentar cancelar una cita que ya está confirmada | `GestionCitas::cancelar()` | Caja Negra |
| Registrar una nueva mascota exitosamente | `GestionMascotas::registrar()` | Caja Negra |
| Intentar registrar una mascota sin nombre | `GestionMascotas::registrar()` | Caja Negra |
| Intentar registrar una mascota con especie vacía | `GestionMascotas::registrar()` | Caja Negra |

### Mapeo a la Arquitectura Hexagonal

| Escenario | Puerto Primario | Adaptador Primario | Caso de Uso |
|-----------|-----------------|-------------------|--------------|
| Gestionar citas | `GestionCitas` | `CitaController` | `GestionCitasImpl` |
| Registrar mascota | `GestionMascotas` | `MascotaController`| (Pendiente) |
