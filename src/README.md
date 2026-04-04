/**
 * Clean Architecture Folder Structure
 * 
 * src/
 * ├── presentation/     UI Components, Screens, Hooks, Navigation
 * │   ├── components/   Reusable UI components
 * │   ├── screens/      Screen/Page components
 * │   ├── hooks/        Custom React hooks
 * │   └── navigation/   Navigation configuration
 * │
 * ├── domain/          Business logic & entities
 * │   ├── entities/    Domain models
 * │   ├── repositories/ Repository interfaces
 * │   └── usecases/    Use cases/business logic
 * │
 * ├── data/            Data layer implementation
 * │   ├── datasources/ API/DB data sources
 * │   ├── models/      Data transfer objects
 * │   └── repositories/ Repository implementations
 * │
 * └── shared/          Shared utilities & configs
 *     ├── utils/       Helper functions
 *     ├── theme/       Theme colors & fonts
 *     └── validators/  Validation functions
 * 
 * Path Aliases (tsconfig.json):
 * @presentation/* → ./src/presentation/*
 * @domain/*       → ./src/domain/*
 * @data/*         → ./src/data/*
 * @shared/*       → ./src/shared/*
 * @config/*       → ./src/config/*
 */
